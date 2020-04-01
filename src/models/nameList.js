import { message } from 'antd';
import queryString from 'query-string';
import { jobAppliedAsPostAll, fetchMessage } from '../services/nameList';
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
    requestFilter: { orderBy: { applyDate: 'DESC' }, pageSize: 50, pageNum: 1 },
  },
  effects: {
    *getNameList({ payload }, { call, put, select }) {
      try {
        const requestFilter = yield select(({ chatrecord: { requestFilter } }) => requestFilter);
        const nameList = yield call(jobAppliedAsPostAll, { ...requestFilter, ...payload });
        yield put({
          type: 'save',
          payload: {
            nameList,
          },
        });
      } catch (e) {
        return Promise.reject(e);
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
    // //
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
  },
  reducers: {
    save(state, { payload }) {
      return { ...state, ...payload };
    },
    getFlowList(state, { payload }) {
      let { timeList, selectJobId } = state;
      if (payload && payload.selectJobId) {
        selectJobId = payload.selectJobId;
      }
      if (payload && payload.timeList) {
        timeList = payload.timeList;
      }
      let flowList = [];
      let phoneMessage = [];
      if (!selectJobId || !(timeList && timeList.length)) {
        return { ...state, flowList, backShowTime: {}, phoneMessage };
      }
      const list = timeList.filter(item => item.applyId === selectJobId);
      const backShowTime = list.length ? list.slice(-1)[0] : {};
      flowList = timeList
        .filter(item => item.applyId === selectJobId)
        .filter(item => item.flow.length > 0 || item.notifyMessage.length > 0)
        .map(item => {
          if (!item.flow) {
            item.flow = [];
          }
          if (!item.notifyMessage) {
            item.notifyMessage = [];
          }
          return [...item.flow, ...item.notifyMessage];
        });
      flowList = flatten(flowList);
      // phoneMessage = timeList
      //   .filter(item => item.applyId === selectJobId)
      //   .filter(item => item.notifyMessage.length > 0 )
      //   .map(item => item.notifyMessage);
      // phoneMessage = flatten(phoneMessage);
      return { ...state, flowList, backShowTime, phoneMessage };
    },
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, search }) => {
        const match = /^\/AI\/namelist/.exec(pathname);
        const matchRecord = /^\/AI\/record/.exec(pathname);
        if (match) {
          dispatch({
            type: 'getNameList',
          });
        } else if (matchRecord) {
          dispatch({
            type: 'getMessage',
            payload: queryString.parse(search),
          });
          //   dispatch({
          //     type: 'queryTimeList',
          //     payload: queryString.parse(search),
          //   });
        }
      });
    },
  },
};
