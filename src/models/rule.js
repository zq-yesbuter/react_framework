import queryString from 'query-string';
import {
  getBatch,
} from '../services/scene';

export default {
  namespace: 'rule',
  state: {
    nameList: [],
    flowList: [],
    phoneMessage: [],
    backShowTime: {},
    batchRequest: { orderBy: { createdDate: 'DESC' }, pageSize: 50, pageNum: 1 },
    nameRequest: { pageSize: 50, pageNum: 1 },
    ivrIntents: [],
    batchList: [],
    configValue: {},
    listValue: {},
    invitations: [],
    configNameList: [],
    taskQueryValue: {},
    batchCur: 1,
    batchPageSize: 50,
    batchTotal: 0,
    nameCur: 1,
    namePageSize: 50,
    nameTotal: 0,
    batchDetail: {},
    deleteNameList: [],
    messageList: [],
    resultList: [],
  },
  effects: {
    *getList({ payload }, { call, put, select }) {
      try {
        const batchRequest = yield select(({ scene: { batchRequest } }) => batchRequest);
        const taskQueryValue = yield select(({ scene: { taskQueryValue } }) => taskQueryValue);
        const batchObj = yield call(getBatch, { ...batchRequest,...taskQueryValue, ...payload });
        const nameList = (batchObj && batchObj.data) || [];
        const nameCur = batchObj && batchObj.curPage;
        const namePageSize = batchObj && batchObj.pageSize;
        const nameTotal = batchObj && batchObj.total;
        yield put({
          type: 'save',
          payload: {
            nameList,
            nameCur,
            namePageSize,
            nameTotal,
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
    formatNameList(state, { payload }) {
      const { nameList } = payload;
      const flatNameList = nameList.map(item => {
        let obj = {};
        item.expected.forEach(item => Object.assign(obj, item));
        return { ...item, ...obj };
      });
      return { ...state, nameList: flatNameList };
    },
    formatConfigNameList(state, { payload }) {
      const { nameList } = payload;
      const flatNameList = nameList.map(item => {
        let obj = {};
        item.expected.forEach(item => Object.assign(obj, item));
        return { ...item, ...obj };
      });
      return { ...state, configNameList: flatNameList };
    },
    getFlowList(state, { payload }) {
      const { flowList } = payload;
      const { flow = [] } = flowList;
      // let { timeList, selectJobId } = state;
      // if (payload && payload.selectJobId) {
      //   selectJobId = payload.selectJobId;
      // }
      // if (payload && payload.timeList) {
      //   timeList = payload.timeList;
      // }
      // let flatFlowList = [];
      // let phoneMessage = [];
      // if (!selectJobId || !(timeList && timeList.length)) {
      //   return { ...state, flowList, backShowTime: {}, phoneMessage };
      // }
      // const list = timeList.filter(item => item.applyId === selectJobId);
      // const backShowTime = list.length ? list.slice(-1)[0] : {};

      // flatFlowList =
      //   flowList.filter(item => item.flow.length > 0 || item.notifyMessage.length > 0)
      //   .map(item => {
      //     if (!item.flow) {
      //       item.flow = [];
      //     }
      //     if (!item.notifyMessage) {
      //       item.notifyMessage = [];
      //     }
      //     return [...item.flow, ...item.notifyMessage];
      //   });
      const flatFlowList = flow.reduce((arr, item) => {
        arr.push(item);
        if (item.notifyMessage && item.notifyMessage.length) {
          item.notifyMessage.forEach(val => arr.push(val));
        }
        return arr;
      }, []);
      return { ...state, flowList: flatFlowList, listValue: flowList };
    },
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, search }) => {
        const match = /^\/AI\/rule/.exec(pathname);

        // 名单列表
        if (match) {
          dispatch({
            type: 'getList',
          });
        } 
      });
    },
  },
};
