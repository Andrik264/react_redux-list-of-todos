import {
  createStore,
  AnyAction,
  combineReducers,
  applyMiddleware,
  Dispatch,
} from 'redux';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
import {
  todosReducer,
  TodosState,
  actions as todosActions,
  selectors as todosSelectors,
} from './todos';
// eslint-disable-next-line import/no-cycle
import {
  UserState,
  userReducer,
  selectors as userSelectors,
} from './user';
import { getTodos } from '../api';

// Action types - is just a constant. MUST have a unique value.
const START_LOADING = 'START_LOADING';
const FINISH_LOADING = 'FINISH_LOADING';

// Action creators - a function returning an action object
export const actions = {
  startLoading: () => ({ type: START_LOADING }),
  finishLoading: (message = 'No message') => ({
    type: FINISH_LOADING,
    message,
  }),
  loadTodos: () => async (dispatch: Dispatch) => {
    dispatch(actions.startLoading());
    const todosFromServer = await getTodos();

    dispatch(todosActions.updateAllTodos(todosFromServer));
    dispatch(actions.finishLoading());
  },
};

// Selectors - a function receiving Redux state and returning some data from it
export const selectors = {
  isLoading: (state: CombinedState) => state.root.loading,
  getMessage: (state: CombinedState) => state.root.message,
  getTodos: (state: CombinedState) => todosSelectors.getTodos(state.todos),
  getSelectedTodo: (state: CombinedState) => (
    todosSelectors.getSelectedTodo(state.todos)),
  getLastLoadedUser: (state: CombinedState) => (
    userSelectors.getLastLoadedUser(state.user)),
  isUserLoading: (state: CombinedState) => (
    userSelectors.isUserLoading(state.user)),
};

// Initial state
export interface RootState {
  loading: boolean;
  message: string;
}
export interface CombinedState {
  todos: TodosState;
  root: RootState;
  user: UserState;
}

const initialState: RootState = {
  loading: false,
  message: '',
};

// rootReducer - this function is called after dispatching an action
const rootReducer = (state = initialState, action: AnyAction) => {
  switch (action.type) {
    case START_LOADING:
      return { ...state, loading: true };

    case FINISH_LOADING:
      return {
        ...state,
        loading: false,
        message: action.message,
      };

    default:
      return state;
  }
};

const reducer = combineReducers({
  todos: todosReducer,
  root: rootReducer,
  user: userReducer,
});

// The `store` should be passed to the <Provider store={store}> in `/src/index.tsx`
const store = createStore(
  reducer,
  composeWithDevTools(
    applyMiddleware(thunk),
  ), // allows you to use http://extension.remotedev.io/
);

export default store;
