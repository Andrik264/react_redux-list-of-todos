import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Todo } from '../../types/Todo';

import { selectors } from '../../store';
import {
  actions as todosActions,
} from '../../store/todos';

export const TodoList: React.FC = () => {
  const dispatch = useDispatch();
  const selectedTodo = useSelector(selectors.getSelectedTodo);
  const todos = useSelector(selectors.getTodos);

  const isSelected = useCallback(
    (todo: Todo): boolean => todo.id === selectedTodo?.id,
    [selectedTodo],
  );

  return (
    <>
      <table className="table is-narrow is-fullwidth">
        <thead>
          <tr>
            <th>#</th>
            <th>
              <span className="icon">
                <i className="fas fa-check" />
              </span>
            </th>
            <th>Title</th>
            <th> </th>
          </tr>
        </thead>

        <tbody>
          {todos.map(todo => (
            <tr data-cy="todo" className="todo" key={todo.id}>
              <td className="is-vcentered">{todo.id}</td>
              <td className="is-vcentered">
                {todo.completed && (
                  <span
                    className="icon"
                    data-cy="iconCompleted"
                  >
                    <i className="fas fa-check" />
                  </span>
                )}
              </td>
              <td className="is-vcentered is-expanded">
                <p
                  className={todo.completed
                    ? 'has-text-success'
                    : 'has-text-danger'}
                >
                  {todo.title}
                </p>
              </td>
              <td className="has-text-right is-vcentered">
                <button
                  className="button"
                  data-cy="selectButton"
                  type="button"
                  onClick={() => dispatch(todosActions.selectTodo(todo))}
                >
                  <span className="icon">
                    <i className={`fa-solid fa-eye${isSelected(todo) ? '-slash' : ''}`} />
                  </span>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};
