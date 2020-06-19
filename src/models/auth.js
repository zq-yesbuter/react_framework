import queryString from 'query-string';
import moment from 'moment';
import _ from 'lodash';
import { fetchDepartment, creactSub, editDepartment, addUser, queryUser } from '../services/auth';

const now = moment().subtract(14, 'days');
const deadLine = moment();
const format = 'YYYY-MM-DD';
const batchRequest = {
  orderBy: { createdDate: 'DESC' },
  pageSize: 20,
  pageNum: 1,
  dateStart: now.format(format) + ' 00:00:00',
  dateEnd: deadLine.format(format) + ' 23:59:59',
};

export default {
  namespace: 'auth',
  state: {
    departList: [],
    baseDepartList: [],
    userList: [],
    treeDepartList: [],
  },
  effects: {
    *fetchDepartment({ payload }, { call, put, select }) {
      try {
        const departList = yield call(fetchDepartment,payload);
        yield put({
          type: 'formatDepartList',
          payload: {
            departList,
          },
        });
      } catch (e) {
        // return Promise.reject(e);
      }
    },
    *query({ payload }, { call, put, select }) {
      try {
        const userList = yield call(queryUser, payload);
        yield put({
          type: 'save',
          payload: {
            userList,
          },
        });
      } catch (e) {
        console.error(e);
      }
    },
    *creactSub({ payload }, { call }) {
      return yield call(creactSub, { ...payload });
    },
  },
  reducers: {
    save(state, { payload }) {
      return { ...state, ...payload };
    },
    formatDepartList(state, { payload }) {
      const { departList = [] } = payload;
      const cloneList = _.cloneDeep(departList);
      const idMapping = cloneList.reduce((acc, el, i) => {
        acc[el.id] = i;
        return acc;
      }, {});
      let root = {};
      cloneList.forEach(el => {
        // 判断根节点
        if (!el.parentId) {
          root = el;
          return;
        }
        // 用映射表找到父元素
        const parentEl = cloneList[idMapping[el.parentId]];
        // 把当前元素添加到父元素的`children`数组中
        parentEl.children = [...(parentEl.children || []), el];
      });
      return {
        ...state,
        departList: [root],
        baseDepartList: departList,
        treeDepartList: root.children,
      };
    },
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, search }) => {
        const match = /^\/AI\/authority/.exec(pathname);

        if (match) {
          dispatch({
            type: 'query',
            payload: { pageSize: 1000, pageNum: 1 },
          });
          dispatch({
            type: 'fetchDepartment',
            payload: { pageSize: 1000, pageNum: 1 },
          });
        }
      });
    },
  },
};
