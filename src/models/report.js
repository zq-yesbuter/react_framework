import queryString from 'query-string';
import moment from 'moment';
import { getReport, getScene, getOperation } from '../services/report';
import {
  getIvrIntents,
} from '../services/nameList';
import { fetchDepartment } from '../services/auth';
const now = moment().subtract(14, 'days');
const deadLine = moment();
const format = 'YYYY-MM-DD HH:mm:ss';
const basicQuery = {
  startTime: moment().startOf('month').format(format),
  endTime: moment().endOf('month').format(format),
};
const query = {
  tenantMerged: true,
  timeMerged: true,
  startTime: moment().startOf('month').format(format),
  endTime: moment().endOf('month').format(format),
};
export default {
  namespace: 'report',
  state: {
    reportList: [],
    sceneList: [],
    operList: [],
    ivrIntents: [],
  },
  effects: {
    *getReport({ payload }, { call, put }) {
      return yield call(getReport, { ...basicQuery, ...payload });
      // yield put({
      //   type: 'save',
      //   payload: {
      //     reportList,
      //   },
      // });
    },
    *getScene({ payload }, { call, put }) {
      return yield call(getScene, { ...query, ...payload });
      // yield put({
      //   type: 'save',
      //   payload: {
      //     sceneList,
      //   },
      // });
    },
    *getOperation({ payload }, { call, put }) {
      return yield call(getOperation, { ...query, ...payload });
    },
    // 获取外呼类型
    *fetchIvrIntents({ payload }, { call, put }) {
      const ivrIntents = yield call(getIvrIntents, payload);
      yield put({
        type: 'save',
        payload: {
          ivrIntents,
        },
      });
    },
    // 获取组织信息
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
        // departList: [root],
        // baseDepartList: departList,
        treeDepartList: [root],
      };
    },
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, search }) => {
        const match = /^\/AI\/report/.exec(pathname);
        if (match) {
          dispatch({
            type: 'fetchIvrIntents',
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
