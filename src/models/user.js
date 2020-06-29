import { queryCurrent } from '@/services/user';

export default {
  namespace: 'user',

  state: {
    list: [],
    currentUser: {},
    menuList: [],
    menuLoading: true,
    robotList: [],
  },

  effects: {
    *logout(_, { call }) {
      try {
        yield call(loginOut);
      } catch (error) {
        return;
      }
    },
    *fetchCurrent(_, { call, put }) {
      let response = {};
      try {
        response = yield call(queryCurrent);
      } catch (error) {
        response = {};
      }

      yield put({
        type: 'saveCurrentUser',
        payload: response,
      });
      return Promise.resolve(response);
    },
    *fetchRobotList(_, { call, put }) {
      const data = yield call(queryRobotList);
      yield put({
        type: 'saveRobotList',
        payload: data,
      });
      return Promise.resolve(data);
    },
    *fetchMenuList({ payload }, { call, put }) {
      // 请求菜单级别的权限
      let data = yield call(queryMenu, payload);
      // data = menuFormat(data, payload.roleType);
      // setAuthorityMenu(data);
      yield put({
        type: 'saveMenuList',
        payload: data,
      });
    },
    *selectRobot({ payload }, { call, put, select }) {
      yield call(selectRobot, payload);
      let robotList = yield select(({ user: { robotList } }) => robotList);

      robotList = robotList.map(item => ({ ...item, selected: payload.id === item.id }));
      yield put({
        type: 'saveRobotList',
        payload: robotList,
      });
      yield put(routerRedux.replace('/'));
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
      return {
        ...state,
        currentUser: action.payload,
      };
    },
    changeNotifyCount(state, action) {
      return {
        ...state,
        currentUser: {
          ...state.currentUser,
          notifyCount: action.payload,
        },
      };
    },
    saveMenuList(state, { payload }) {
      return {
        ...state,
        menuList: payload,
      };
    },
    saveRobotList(state, { payload }) {
      return {
        ...state,
        robotList: payload,
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
