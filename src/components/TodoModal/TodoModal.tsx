import React, { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { selectors } from '../../store';
import { actions as userActions } from '../../store/user';
import { actions as todosActions } from '../../store/todos';

import { Todo } from '../../types/Todo';

import { Loader } from '../Loader';

interface Props {
  selectedTodo: Todo;
}

export const TodoModal: React.FC<Props> = ({ selectedTodo }) => {
  const dispatch = useDispatch();
  const user = useSelector(selectors.getLastLoadedUser);
  const isUserLoading = useSelector(selectors.isUserLoading);

  useEffect(() => {
    if (!selectedTodo) {
      return;
    }

    dispatch(userActions.loadUser(selectedTodo));
  }, []);

  const closeModal = useCallback(() => {
    dispatch(todosActions.selectTodo(selectedTodo));
  }, []);

  return (
    <div className="modal is-active" data-cy="modal">
      <div className="modal-background" />

      {isUserLoading ? (
        <Loader />
      ) : (
        <div className="modal-card">
          <header className="modal-card-head">
            <div
              className="modal-card-title has-text-weight-medium"
              data-cy="modal-header"
            >
              {`Todo: ${selectedTodo.id}`}
            </div>

            {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
            <button
              type="button"
              className="delete"
              data-cy="modal-close"
              onClick={closeModal}
            />
          </header>

          <div className="modal-card-body">
            <p className="block" data-cy="modal-title">
              {selectedTodo.title}
            </p>

            {user && (
              <p className="block" data-cy="modal-user">
                {selectedTodo.completed
                  ? <strong className="has-text-success">Done</strong>
                  : <strong className="has-text-danger">Planned</strong>}

                {' by '}

                <a href={`mailto:${user?.email}`}>
                  {user?.name}
                </a>
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
