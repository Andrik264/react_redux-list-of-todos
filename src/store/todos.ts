import { AnyAction } from 'redux';
import { Todo } from '../types/Todo';
import { Filter } from '../types/Filter';

const ADD_TODO = 'todos/add';
const REMOVE_TODO = 'todos/remove';
const UPDATE_ALL_TODOS = 'todos/updateAllTodos';
const SELECT_TODO = 'todos/selectTodo';
const FILTER = 'todos/filter';

export const actions = {
  add: (newTodo: Todo) => ({ type: ADD_TODO, newTodo }),
  delete: (todo: Todo) => ({ type: REMOVE_TODO, todo }),
  updateAllTodos: (todos: Todo[]) => ({ type: UPDATE_ALL_TODOS, todos }),
  selectTodo: (todo: Todo) => ({ type: SELECT_TODO, todo }),
  filterBy: (filters: Filter) => ({ type: FILTER, filters }),
};

export const selectors = {
  getTodos: (state: TodosState) => state.filteredTodos,
  getSelectedTodo: (state: TodosState) => state.selectedTodo,
};

export interface TodosState {
  todos: Todo[];
  filteredTodos: Todo[];
  selectedTodo: Todo | null;
}

const initialState: TodosState = {
  todos: [],
  filteredTodos: [],
  selectedTodo: null,
};

function getFilteredTodos(
  filters: { status: string; title: string; },
  todos: Todo[],
) {
  if (!Object.values(filters).some(Boolean)) {
    return todos;
  }

  let filteredTodos = [...todos];
  const entries = Object.entries(filters);

  entries.forEach(([filterBy, filterValue]) => {
    switch (filterBy) {
      case 'status': {
        const booleanValue = filterValue === 'completed';

        filteredTodos = [
          ...filteredTodos.filter(todo => todo.completed === booleanValue),
        ];

        break;
      }

      case 'title':
        filteredTodos = [
          ...filteredTodos.filter(todo => todo.title.includes(filterValue)),
        ];
        break;

      default:
        break;
    }
  });

  return filteredTodos;
}

export const todosReducer = (state = initialState, action: AnyAction) => {
  switch (action.type) {
    case ADD_TODO:
      return {
        ...state,
        todos: [action.newTodo, ...state.todos],
      };

    case REMOVE_TODO:
      return {
        ...state,
        todos: state.todos.filter(todo => todo.id !== action.todo.id),
      };

    case UPDATE_ALL_TODOS:
      return {
        ...state,
        todos: action.todos,
        filteredTodos: action.todos,
      };

    case SELECT_TODO:
      return {
        ...state,
        selectedTodo: state.selectedTodo?.id === action.todo.id
          ? null
          : action.todo,
      };

    case FILTER:
      return {
        ...state,
        filteredTodos: getFilteredTodos(action.filters, state.todos),
      };

    default:
      return state;
  }
};
