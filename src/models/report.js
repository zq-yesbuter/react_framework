import queryString from 'query-string';
import moment from 'moment';
import { getReport, getScene, getOperation } from '../services/report';
import {
  getIvrIntents,
} from '../services/nameList';
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
  },
  reducers: {
    save(state, { payload }) {
      return { ...state, ...payload };
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
        //     dispatch({
        //       type: 'getReport',
        //     });
        //     dispatch({
        //       type:'getScene',
        //     })
        //     dispatch({
        //       type:'getOperation',
        //     })
        }
      });
    },
  },
};
