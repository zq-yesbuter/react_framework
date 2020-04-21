import queryString from 'query-string';
import { fetchMessage, getIvrIntents, getBatch, getBatchDetail, getFlowlist, getSigleFlowlist} from '../services/nameList';

export default {
  namespace: 'namelist',
  state: {
    nameList: [],
    flowList: [],
    phoneMessage: [],
    backShowTime: {},
    batchRequest: {orderBy: { createdDate: 'DESC' },pageSize: 50, pageNum: 1}, 
    nameRequest: {pageSize: 50, pageNum: 1},
    ivrIntents: [],
    batchList: [],
    configValue: {},
    listValue: {},
    invitations: [],
    configNameList: [],
    taskQueryValue: {},
    batchCur:1,
    batchPageSize:50,
    nameCur:1,
    namePageSize:50,
    batchDetail: {},
    deleteNameList: [],
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
    *fetchIvrIntents({ payload }, { call, put, select }) {
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
      const {data:nameList} = response;
      const nameCur = response && response.curPage;
      const namePageSize = response && response.pageSize;
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
      const response = yield call(getBatchDetail, {...payload,pageNum: 1,pageSize: 10000});
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
    *getConfigValue({ payload }, { call, put, select }) {
      const response = yield call(getBatch, payload);
      const { data } = response;
      // console.log('configValue====>', configValue);
      yield put({
        type: 'save',
        payload: {
          configValue:data[0],
        },
      });
    },
    *getBatchDetail({ payload }, { call, put, select }) {
      const response = yield call(getBatch, payload);
      const { data } = response;
      // console.log('configValue====>', configValue);
      yield put({
        type: 'save',
        payload: {
          batchDetail:data[0],
        },
      });
    },
    *deleteMore({ payload }, { call, put, select }) {
      return yield call(getBatchDetail, {...payload});
    },
  },
  reducers: {
    save(state, { payload }) {
      return { ...state, ...payload };
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
      //     }s
      //     return [...item.flow, ...item.notifyMessage];
      //   });
      const flatFlowList = [...flowList.flow, ...flowList.notifyMessage];
      return { ...state, flowList:flatFlowList,listValue: flowList };
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
        // 消息记录
        } else if (matchRecord) {
          dispatch({
            type: 'fetchIvrIntents',
          });
          const { group, intent } = queryString.parse(search) || {};
          dispatch({
            type: 'getMessage',
            payload: {group, intent},
          });
          dispatch({
            type: 'getSigleFlowlist',
            payload: {id:group,intent},
          }); 
        // 配置页面
        }else if(matchConfig) {
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
        }else if(mainMatch) {
          dispatch({
            type: 'getBatch',
            payload: {},
          });
          dispatch({
            type: 'fetchIvrIntents',
          });
        }
      });
    },
  },
};
