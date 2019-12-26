import { message } from 'antd';
import {
  addJob,
  queryJobs,
  queryInformation,
  createJob,
  resolveRobotFeatures,
  fetchAllResume,
  fetchResume,
  jobApply,
  jobApplyAsNewResume,
  resumeApplyAsFile,
  jobApplied,
  jobAppliedAsPost,
  jobAppliedAsPostAll,
  addInvitation,
  editInvitation,
  fetchInvitation,
  fetchMessage,
  auth,
  authenticate,
  supervisor,
  operator,
  operatorPersonnel,
} from '../services/ai';
import { getDateString,flatten } from '../utils/utils';

export default {
  namespace: 'chatrecord',
  state: {
    messageList: [],
    jobList: [],
    timeList: [],
    resumeObj: {},
    selectJobId: null,
    flowList: [],
    tableLoading: false,
    postList: [],
    backShowTime: {},
    bottomLoading: false,
    notData: false,
    pageNum: 1,
  },
  effects: {
    // 获取微信聊天记录
    *getMessage({ payload }, { call, put, select }) {
      try {
        const messageList = yield call(fetchMessage, payload);
        yield put({
          type: 'save',
          payload: {
            messageList,
          },
        });
      } catch (e) {
        return Promise.reject(e);
      }
    },
    *jobAppliedAsPostAll({ payload }, { call, put, select }) {
      try {
        yield put({
          type: 'save',
          payload: {
            tableLoading: true,
            pageNum: 1,
          },
        });
        const jobList = yield call(jobAppliedAsPostAll, payload);
        const selectJobId = jobList && jobList[0] && jobList[0].applyId || undefined;
        if(!selectJobId) { 
          yield put({
            type: 'save',
            payload: {
              tableLoading: false,
            },
          });
          yield put({
            type: 'save',
            payload: {
              selectJobId,
            },
          });
          yield put({
            type: 'formatJobList',
            payload: {
              jobList,
            },
          });
          return;
        }
        yield put({
          type: 'save',
          payload: {
            selectJobId,
            notData: false,
          },
        });
        yield put({
          type: 'formatJobList',
          payload: {
            jobList,
          },
        });
        yield put({
          type: 'save',
          payload: {
            tableLoading: false,
          },
        });
        // const applyIds = jobList.filter(item => item.status > 20).map(item => item.applyId);
        const applyIds = jobList.map(item => item.applyId) || [];
        if (applyIds.length) {
          yield put({
            type: 'fetchInvitation',
            payload: {
              applyIds,
            },
          });
        }
        const resumeId = jobList[0].resumeId;
        yield put({
          type: 'getMessage',
          payload: {
            group: selectJobId,
          },
        });
        yield put({
          type: 'fetchResume',
          payload: {
            resumeId,
          },
        });
      } catch (e) {
        message.error(e.message);
      }
    },
    *fetchResume({ payload }, { call, put, select }) {
      const resumeObj = yield call(fetchResume, payload);
      yield put({
        type: 'save',
        payload: {
          resumeObj,
        },
      });
    },
    *fetchInvitation({ payload }, { call, put }) {
      try {
        const timeList = yield call(fetchInvitation, payload);
        yield put({
          type: 'save',
          payload: {
            timeList,
          },
        });
        yield put({
          type: 'getFlowList',
          payload: {timeList},
        });
      } catch (e) {
        return Promise.reject(e);
      }
    },
    *addInvitation({ payload }, { call, put, select }) {
      return yield call(addInvitation, payload);
    },
    *editInvitation({ payload }, { call, put, select }) {
      return yield call(editInvitation, payload);
    },
    *queryInformation({ payload }, { call, put, select }) {
      try {
        const postList = yield call(queryInformation, payload);
        yield put({
          type: 'save',
          payload: {
            postList,
          },
        });
      } catch (e) {
        return Promise.reject(e);
      }
    },
    *queryTimeList({ payload }, { call, put, select }) {
      const jobList = yield select(({ chatrecord: { jobList } }) => jobList);
      const applyIds = jobList.map(item => item.applyId) || [];
      if (applyIds.length) {
        const timeList = yield call(fetchInvitation, { applyIds });
        const { selectJobId } = payload;
        yield put({
          type: 'getFlowList',
          payload: {selectJobId,timeList},
        });
      }
    },
    *loadMoreList({ payload }, { call, put, select }) {
      try {
        yield put({
          type: 'save',
          payload: {
            bottomLoading: true,
          },
        });
        const moreJobList = yield call(jobAppliedAsPostAll, payload);
        if(!(moreJobList && moreJobList.length)) { 
          yield put({
            type: 'save',
            payload: {
              bottomLoading: false,
              notData: true,
              pageNum: 1,
            },
          });
          return;
        }
        yield put({
          type: 'save',
          payload: {
            bottomLoading: false,
          },
        });
        const jobList = yield select(({ chatrecord: { jobList } }) => jobList);
        const newJobList = jobList.concat(moreJobList);
        yield put({
          type: 'formatJobList',
          payload: {
            jobList: newJobList,
          },
        });
        const applyIds = newJobList.map(item => item.applyId) || [];
        if (applyIds.length) {
          yield put({
            type: 'fetchInvitation',
            payload: {
              applyIds,
            },
          });
        }
      } catch (e) {
        return Promise.reject(e);
      }
    },
    *updateSingleInvent({ payload }, { call, put, select }) {
      console.log('payload====>',payload)
      const timeList = yield call(fetchInvitation, payload);
      
    },
  },
  reducers: {
    save(state, { payload }) {
      return { ...state, ...payload };
    },
    getMessageList(state, { payload }) {
      const { messageList } = payload;
      const concatMessageList = messageList.reverse().concat(state.messageList);
      return { ...state, messageList: concatMessageList };
    },
    getFlowList(state, { payload }) {
      let { timeList, selectJobId } = state;
      if (payload && payload.selectJobId) {
        selectJobId = payload.selectJobId;
      }
      if(payload && payload.timeList) {
        timeList = payload.timeList;
      }
      let flowList = [];
      if (!selectJobId || !(timeList && timeList.length)) {
        return { ...state, flowList };
      }
      const list = timeList.filter(item => item.applyId === selectJobId);
      const backShowTime = list.length ? list.slice(-1)[0] : {};
      flowList = timeList
        .filter(item => item.applyId === selectJobId)
        .filter(item => item.flow.length > 0)
        .map(item => item.flow);
      flowList = flatten(flowList);
      return { ...state, flowList,backShowTime };
    },
    formatJobList(state, { payload }) {
      let { jobList:newJobList } = payload;
      const jobList=newJobList.map(item => ({...item,disabled:(!!((item.status === 23 || item.status === 24))) }));
      return { ...state, jobList }
    },
  },
  subscriptions: {
    setup({ history, dispatch }) {
      return history.listen(({ pathname, search }) => {
        const pathList = pathname.split('/');
        const userId = search.split('=');
        if (pathList[1] === 'chatRecord') {
          dispatch({ type: 'init', payload: { userId: userId[1] } });
        }
      });
    },
  },
};
