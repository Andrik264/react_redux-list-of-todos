import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import './App.scss';

import { actions, selectors } from './store';

import { TodoList } from './components/TodoList';
import { Loader } from './components/Loader';
import { TodoModal } from './components/TodoModal';
import { TodoFilter } from './components/TodoFilter';

const App = () => {
  const dispatch = useDispatch();
  const loading = useSelector(selectors.isLoading);
  const selectedTodo = useSelector(selectors.getSelectedTodo);

  useEffect(() => {
    dispatch(actions.loadTodos());
  }, []);

  return (
    <div className="App">
      <div className="App__container">
        <h1 className="is-size-2">Redux list of todos:</h1>

        <TodoFilter />

        <div className="todoList">
          {loading
            ? <Loader />
            : <TodoList />}
        </div>

        {selectedTodo && <TodoModal selectedTodo={selectedTodo} />}
      </div>
    </div>
  );
};

export default App;
