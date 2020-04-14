import { message } from 'antd';
import queryString from 'query-string';
import { jobAppliedAsPostAll, fetchMessage, getIvrIntents, getBatch, getBatchDetail, getFlowlist, getSigleFlowlist} from '../services/nameList';
import { getDateString, flatten } from '../utils/utils';

function formatInventTime(timeList, applyId) {
  const list = timeList.filter(item => item.applyId === applyId);
  return list.length ? list.slice(-1)[0].interviewTime : null;
}
function formatTriggerTime(timeList, applyId) {
  const list = timeList.filter(item => item.applyId === applyId);
  return list.length ? list.slice(-1)[0].triggerTime : null;
}

export default {
  namespace: 'namelist',
  state: {
    nameList: [],
    flowList: [],
    phoneMessage: [],
    backShowTime: {},
    batchRequest: {pageSize: 10, pageNum: 1},
    nameRequest: {pageSize: 10, pageNum: 1},
    ivrIntents: [],
    batchList: [],
    configValue: {},
    listValue: {},
    invitations: [],
    configNameList: [],
    taskQueryValue: {},
    batchCur:1,
    batchPageSize:10,
    nameCur:1,
    namePageSize:10,
  },
  effects: {
    *getBatch({ payload }, { call, put, select }) {
      try {
        const batchRequest = yield select(({ namelist: { batchRequest } }) => batchRequest);
        const batchObj = yield call(getBatch, { ...batchRequest, ...payload });
        const batchList = batchObj && batchObj.data || [];
        const batchCur = batchObj && batchObj.curPage;
        const batchPageSize = batchObj && batchObj.pageSize;
        yield put({
          type: 'save',
          payload: {
            batchList,
            batchCur,
            batchPageSize,
          },
        });
      } catch (e) {
        // return Promise.reject(e);
      }
    },

    // 获取微信聊天记录
    *getMessage({ payload }, { call, put, select }) {
      const messageList = yield call(fetchMessage, payload);
      yield put({
        type: 'save',
        payload: {
          messageList,
        },
      });
    },

    // 获取外呼类型
    *getIvrIntents({ payload }, { call, put, select }) {
      const ivrIntents = yield call(getIvrIntents, payload);
      yield put({
        type: 'save',
        payload: {
          ivrIntents,
        },
      });
    },

    *getBatchDetail({ payload }, { call, put, select }) {
      const nameRequest = yield select(({ namelist: { nameRequest } }) => nameRequest);
      const response = yield call(getBatchDetail, { ...nameRequest, ...payload }) || {};
      const {data:nameList} = response;
      const nameCur = response && response.curPage;
      const namePageSize = response && response.pageSize;
      console.log('nameLis===>',nameList);
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
        },
       
      })
    },
    *configNameList({ payload }, { call, put, select }) {
      const response = yield call(getBatchDetail, payload);
      const {data:nameList} = response;
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
    *getFlowlist({ payload }, { call, put, select }) {
      const flowList = yield call(getFlowlist, payload);
      yield put({
        type: 'getFlowList',
        payload: {
          flowList,
        },
      });
    },
    *getSigleFlowlist({ payload }, { call, put, select }) {
      const flowList = yield call(getSigleFlowlist, payload);
      yield put({
        type: 'getFlowList',
        payload: {
          flowList,
        },
      });
    },
  },
  reducers: {
    save(state, { payload }) {
      return { ...state, ...payload };
    },
    addBatchname(state, { payload }) {
      const { batchList } = state;
      batchList.unshift(payload);
      console.log('batchList===>',batchList);
      return { ...state };
    },
    formatNameList(state, { payload }) {
      const { nameList } = payload;
      const flatNameList = nameList.map(item => {
        let obj={};
        item.expected.forEach(item => Object.assign(obj, item) )
        return {...item,...obj}
      })
      return { ...state,nameList:flatNameList };
    },
    formatConfigNameList(state, { payload }) {
      const { nameList } = payload;
      const flatNameList = nameList.map(item => {
        let obj={};
        item.expected.forEach(item => Object.assign(obj, item) )
        return {...item,...obj}
      })
      return { ...state,configNameList:flatNameList };
    },
    getFlowList(state, { payload }) {
      const { flowList } = payload;
      console.log('flowList====>',flowList)
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
      const flatFlowList = [...flowList.flow, ...flowList.notifyMessage];
      console.log('flatFlowList===>',flatFlowList);
      return { ...state, flowList:flatFlowList };
    },
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, search }) => {
        const match = /^\/AI\/outging\/namelist/.exec(pathname);
        const matchRecord = /^\/AI\/outging\/record/.exec(pathname);
        const matchConfig = /^\/AI\/outging\/config/.exec(pathname);
        const mainMatch = /^\/AI\/outging$/.exec(pathname);
        // 名单列表
        if (match) {
          // 新的获取名单列表
          dispatch({
            type: 'getBatchDetail',
            payload: queryString.parse(search),
          });
          dispatch({
            type: 'getIvrIntents',
          });
        // 消息记录
        } else if (matchRecord) {
          dispatch({
            type: 'getMessage',
            payload: queryString.parse(search),
          });
          const { group, intent } = queryString.parse(search) || {};
          dispatch({
            type: 'getSigleFlowlist',
            payload: {id:group,intent},
          });
        // 配置页面
        }else if(matchConfig) {
          dispatch({
            type: 'getIvrIntents',
          });
        // 任务页面
        }else if(mainMatch) {
          dispatch({
            type: 'getBatch',
            payload: {},
          });
          dispatch({
            type: 'getIvrIntents',
          });
        }
      });
    },
  },
};
