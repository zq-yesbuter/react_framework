import { queryCurrent } from '@/services/user';

const UserModel = {
  namespace: 'user',
  state: {
    currentUser: {},
  },
  effects: {
    *fetch(_, { call, put }) {
      const response = yield call(queryUsers);
      yield put({
        type: 'save',
        payload: response,
      });
    },

    *fetchCurrent(_, { call, put }) {
      const response = yield call(queryCurrent);
      yield put({
        type: 'saveCurrentUser',
        payload: response,
      });
    },

    *initSubsQueue({ payload }, { call, put, all }) {
      let response = {};
      try {
        [response] = yield all([call(queryCurrent)]);
      } catch (error) {
        console.warn(error);
        response = {};
        return;
      }
      if (response) {
        yield put({
          type: 'save',
          payload: { currentUser: response },
        });
      }
    },
  },
  reducers: {
    save(state, { payload }) {
      console.log(payload);
      return { ...state, ...payload };
    },
    saveCurrentUser(state, action) {
      return { ...state, currentUser: action.payload || {} };
    },

    changeNotifyCount(
      state = {
        currentUser: {},
      },
      action
    ) {
      return {
        ...state,
        currentUser: {
          ...state.currentUser,
          notifyCount: action.payload.totalCount,
          unreadCount: action.payload.unreadCount,
        },
      };
    },
  },
  subscriptions: {
    init({ dispatch, history }) {
      const { location: { pathname } } = history;
      // const nonLogin = nonLoginAuthorized(pathname);
      // if (!nonLogin) {
        dispatch({
          type: 'initSubsQueue',
        });
      // }
    },
  },
};
export default UserModel;
