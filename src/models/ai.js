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
import { getDateString } from '../utils/utils';

function flatten(arr) {
  let res = [];
  for (let i = 0; i < arr.length; i++) {
    if (Array.isArray(arr[i])) {
      res = res.concat(flatten(arr[i]));
    } else {
      res.push(arr[i]);
    }
  }
  return res;
}
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
  },
  effects: {
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
    *jobAppliedAsPostAll({ payload }, { call, put, select }) {
      yield put({
        type: 'save',
        payload: {
          tableLoading: true,
        },
      });
      const jobList = yield call(jobAppliedAsPostAll, payload);
      const selectJobId = jobList[0] && jobList[0].applyId || undefined;
      if(!selectJobId) { yield put({
        type: 'save',
        payload: {
          tableLoading: false,
        },
      });
      return;}
      yield put({
        type: 'save',
        payload: {
          jobList,
          selectJobId,
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
      const timeList = yield call(fetchInvitation, payload);
      yield put({
        type: 'save',
        payload: {
          timeList,
        },
      });
      yield put({
        type: 'getFlowList',
      });
    },
    *addInvitation({ payload }, { call, put, select }) {
      return yield call(addInvitation, payload);
    },
    *queryInformation({ payload }, { call, put, select }) {
      const postList = yield call(queryInformation, payload);
      yield put({
        type: 'save',
        payload: {
          postList,
        },
      });
    },
    // *resumeApplyAsFile({ payload }, { call, put, select }) {
    //   const postList = yield call(resumeApplyAsFile, payload);
    //   yield put({
    //     type: 'save',
    //     payload: {
    //       postList,
    //     },
    //   });
    // },
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
      let flowList = [];
      if (!selectJobId || !timeList.length) {
        return { ...state, flowList };
      }
      flowList = timeList
        .filter(item => item.applyId === selectJobId)
        .filter(item => item.flow.length > 0)
        .map(item => item.flow);
      flowList = flatten(flowList);
      return { ...state, flowList };
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
