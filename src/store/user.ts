import { AnyAction, Dispatch } from 'redux';

// eslint-disable-next-line import/no-cycle
import store from '.';

import { User } from '../types/User';
import { Todo } from '../types/Todo';

import { getUser } from '../api';

const ADD = 'user/add';
const LOADING = 'user/loading';
const UPDATE_LAST_LOADED = 'user/updateLastLoaded';

export const selectors = {
  isUserLoading: (state: UserState) => state.isUserLoading,
  getLastLoadedUser: (state: UserState) => state.lastLoadedUser,
  getCachedUser: (userId: number) => (state: UserState) => (
    state.users.find(({ id }) => id === userId)),
  isUserCached: (userId: number) => (state: UserState): boolean => {
    return state.users.some(user => user.id === userId);
  },
};

export const actions = {
  loadUser: (todo: Todo) => async (dispatch: Dispatch) => {
    dispatch(actions.startLoading());
    const { user: userState } = store.getState();

    if (!selectors.isUserCached(todo.userId)(userState)) {
      const loadedUser = await getUser(todo.userId);

      dispatch(actions.add(loadedUser));
    } else {
      const cashedUser = selectors.getCachedUser(todo.userId)(userState);

      if (cashedUser) {
        dispatch(actions.updateLastLoaded(cashedUser));
      }
    }

    dispatch(actions.finishLoading());
  },
  add: (user: User) => ({ type: ADD, user }),
  updateLastLoaded: (user: User) => ({ type: ADD, user }),
  startLoading: () => ({ type: LOADING, loadingStatus: true }),
  finishLoading: () => ({ type: LOADING, loadingStatus: false }),
};

export interface UserState {
  users: User[];
  lastLoadedUser: User | null;
  isUserLoading: boolean;
}

const initialState: UserState = {
  users: [],
  lastLoadedUser: null,
  isUserLoading: false,
};

export const userReducer = (state = initialState, action: AnyAction) => {
  switch (action.type) {
    case LOADING:
      return {
        ...state,
        isUserLoading: action.loadingStatus,
      };

    case ADD:
      return {
        ...state,
        users: [...state.users, action.user],
        lastLoadedUser: action.user,
      };

    case UPDATE_LAST_LOADED:
      return {
        ...state,
        lastLoadedUser: action.user,
      };

    default:
      return state;
  }
};
