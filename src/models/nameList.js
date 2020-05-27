import queryString from 'query-string';
import moment from 'moment';
import {
  fetchMessage,
  getIvrIntents,
  getBatch,
  getBatchDetail,
  getFlowlist,
  getSigleFlowlist,
  getResult,
} from '../services/nameList';

const now = moment().subtract(14,'days');
const deadLine = moment();
const format = 'YYYY-MM-DD';
const batchRequest = {
  orderBy: { createdDate: 'DESC' },
  pageSize: 50,
  pageNum: 1,
  dateStart: now.format(format) + ' 00:00:00',
  dateEnd: deadLine.format(format) + ' 23:59:59',
};

export default {
  namespace: 'namelist',
  state: {
    nameList: [],
    flowList: [],
    phoneMessage: [],
    backShowTime: {},
    batchRequest: batchRequest,
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
    *getBatch({ payload }, { call, put, select }) {
      try {
        const batchRequest = yield select(({ namelist: { batchRequest } }) => batchRequest);
        const taskQueryValue = yield select(({ namelist: { taskQueryValue } }) => taskQueryValue);
        const batchObj = yield call(getBatch, { ...batchRequest, ...taskQueryValue, ...payload });
        const batchList = (batchObj && batchObj.data) || [];
        const batchCur = batchObj && batchObj.curPage;
        const batchPageSize = batchObj && batchObj.pageSize;
        const batchTotal = batchObj && batchObj.total;
        yield put({
          type: 'save',
          payload: {
            batchList,
            batchCur,
            batchPageSize,
            batchTotal,
          },
        });
      } catch (e) {
        // return Promise.reject(e);
      }
    },

    // 获取微信聊天记录
    *getMessage({ payload }, { call, put }) {
      const messageList = yield call(fetchMessage, payload);
      yield put({
        type: 'save',
        payload: {
          messageList,
        },
      });
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

    *fetchBatchDetail({ payload }, { call, put, select }) {
      const nameRequest = yield select(({ namelist: { nameRequest } }) => nameRequest);
      const response = yield call(getBatchDetail, { ...nameRequest, ...payload }) || {};
      const { data: nameList } = response;
      const nameCur = response && response.curPage;
      const namePageSize = response && response.pageSize;
      const nameTotal = response && response.total;
      yield put({
        type: 'formatNameList',
        payload: {
          nameList,
        },
      });
      yield put({
        type: 'save',
        payload: {
          nameCur,
          namePageSize,
          nameTotal,
        },
      });
    },
    *configNameList({ payload }, { call, put }) {
      const response = yield call(getBatchDetail, { ...payload, pageNum: 1, pageSize: 10000 });
      const { data: nameList } = response;
      yield put({
        type: 'formatConfigNameList',
        payload: {
          nameList,
        },
      });
    },
    // *queryTimeList({ payload }, { call, put, select }) {
    //     const jobList = yield select(({ namelist: { nameList } }) => nameList);
    //     const applyIds = jobList.map(item => item.applyId) || [];
    //     if (applyIds.length) {
    //       const timeList = yield call(fetchInvitation, { applyIds });
    //       yield put({
    //         type: 'getFlowList',
    //         payload: { timeList },
    //       });
    //     }
    //   },
    *getFlowlist({ payload }, { call, put }) {
      const flowList = yield call(getFlowlist, payload);
      yield put({
        type: 'getFlowList',
        payload: {
          flowList,
        },
      });
    },
    *getSigleFlowlist({ payload }, { call, put }) {
      const flowList = yield call(getSigleFlowlist, payload);
      yield put({
        type: 'getFlowList',
        payload: {
          flowList,
        },
      });
    },
    *getConfigValue({ payload }, { call, put }) {
      const response = yield call(getBatch, payload);
      const { data } = response;
      // console.log('configValue====>', configValue);
      yield put({
        type: 'save',
        payload: {
          configValue: data[0],
        },
      });
    },
    *getBatchDetail({ payload }, { call, put }) {
      const response = yield call(getBatch, payload);
      const { data } = response;
      // console.log('configValue====>', configValue);
      yield put({
        type: 'save',
        payload: {
          batchDetail: data[0],
        },
      });
    },
    *deleteMore({ payload }, { call }) {
      return yield call(getBatchDetail, { ...payload });
    },
    *getResult({ payload }, { call, put }) {
      const resultList = yield call(getResult, payload);
      yield put({
        type: 'save',
        payload: {
          resultList,
        },
      });
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
        const match = /^\/AI\/outging\/namelist/.exec(pathname);
        const matchRecord = /^\/AI\/outging\/record/.exec(pathname);
        const matchConfig = /^\/AI\/outging\/config/.exec(pathname);
        const mainMatch = /^\/AI\/outging$/.exec(pathname);
        const deleteMatch = /^\/AI\/outging\/delete/.exec(pathname);
        const deleteAll = /^\/AI\/outging\/deleteAll/.exec(pathname);

        if (!match) {
          // 重置消息列表避免bug
          dispatch({
            type: 'save',
            payload: { messageList: [] },
          });
        }
        // 名单列表
        if (match) {
          // 新的获取名单列表
          dispatch({
            type: 'fetchIvrIntents',
          });
          dispatch({
            type: 'fetchBatchDetail',
            payload: queryString.parse(search),
          });
          dispatch({
            type: 'getBatchDetail',
            payload: queryString.parse(search),
          });
          dispatch({
            type: 'getResult',
            payload: queryString.parse(search),
          });
          // 消息记录
        } else if (matchRecord) {
          dispatch({
            type: 'fetchIvrIntents',
          });
          const { group, intent } = queryString.parse(search) || {};
          dispatch({
            type: 'getMessage',
            payload: { group, intent },
          });
          dispatch({
            type: 'getSigleFlowlist',
            payload: { id: group, intent },
          });
          // 配置页面
        } else if (matchConfig) {
          dispatch({
            type: 'fetchIvrIntents',
          });
          dispatch({
            type: 'configNameList',
            payload: queryString.parse(search),
          });
          dispatch({
            type: 'getConfigValue',
            payload: queryString.parse(search),
          });
          // 任务页面
        } else if (mainMatch || deleteAll) {
          dispatch({
            type: 'getBatch',
            payload: { dataStatus: 1 ,...batchRequest},
          });
          dispatch({
            type: 'fetchIvrIntents',
          });
        } else if (deleteMatch) {
          dispatch({
            type: 'getBatch',
            payload: { dataStatus: 2 },
          });
          dispatch({
            type: 'fetchIvrIntents',
          });
        }
      });
    },
  },
};
