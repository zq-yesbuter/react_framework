import { message } from 'antd';
import { getChatList, getWechat, getMessage } from '../services/chatrecord';
import { getDateString } from '../utils/utils';

export default {
  namespace: 'chatrecord',

  state: {
    chatList: [], // 右侧表格数据
    wechatList: [],
    time: getDateString('today'),
    conUserName: '',
    type: 3,
    messageList: undefined,
    tableListLoading: false,
    talker: '',
    bottomLoading: false,
    noLoading: true,
    newTalk: false,
  },

  effects: {
    // 左侧列表
    *getChatList({ payload }, { call, select, put }) {
      const {
        chatrecord: { time },
        chatrecord: { conUserName },
        chatrecord: { type },
      } = yield select();
      yield put({
        type: 'save',
        payload: {
          tableListLoading: true,
        },
      });
      const startTime = `${time.split(',')[0]} 00:00:00`;
      const endTime = `${time.split(',')[1]} 23:59:59`;
      const response = yield call(getChatList, {
        startTime,
        endTime,
        conUserName,
        type,
        ...payload,
      });
      // const response = yield call(getChatList,payload);
      // const response = yield call(getChatList,{
      //   startTime:'2018-05-19 12:00:00',
      //   endTime:'2019-07-19 12:00:00',
      //   conUserName:'wxid_y7626hibui2i22',type:3,...payload});
      if (!response || response.code !== 200) {
        yield put({
          type: 'save',
          payload: {
            tableListLoading: false,
          },
        });
        message.error(response.msg || '操作失败');
      }

      const { data = [] } = response;
      yield put({
        type: 'save',
        payload: {
          talker: data.datas && data.datas[0] && data.datas[0].username,
          tableListLoading: false,
          chatList: data.datas,
        },
      });
      if (data.datas && data.datas[0] && data.datas[0].username) {
        yield put({
          type: 'getMessage',
        });
      } else {
        yield put({
          type: 'save',
          payload: {
            messageList: [],
          },
        });
      }
    },

    // 获取微信聊天记录
    *getMessage({ payload }, { call, put, select }) {
      const {
        chatrecord: { conUserName },
        chatrecord: { talker },
      } = yield select();
      if (!talker && !payload.talker) {
        return;
      }
      const payloadData = {
        conUserName,
        pageNo: 0,
        pageSize: 10,
        talker,
      };
      // const payloadData={conUserName:'wxid_y7626hibui2i22',pageNo:1,pageSize:5,talker}
      yield put({
        type: 'save',
        payload: {
          bottomLoading: true,
        },
      });
      const response = yield call(getMessage, { ...payloadData, ...payload });
      if (!response || response.code !== 200) {
        yield put({
          type: 'save',
          payload: {
            bottomLoading: false,
          },
        });
        message.error(response.msg || '操作失败');
        return;
      }

      const { data } = response;
      if (payload && payload.pageNo > 1) {
        if (data.list && data.list.length === 0) {
          message.warn('本联系人没有更多数据了', 1);
          yield put({
            type: 'save',
            payload: {
              bottomLoading: false,
              noLoading: false,
            },
          });
          return;
        }
      }
      // message.success('已加载新的聊天记录');
      yield put({
        type: 'getMessageList',
        payload: {
          messageList: data.list,
        },
      });
      yield put({
        type: 'save',
        payload: {
          bottomLoading: false,
        },
      });
    },
    // init
    *init({ payload }, { call, put }) {
      const response = yield call(getWechat, payload);
      if (!response || response.code !== 200) {
        message.error(response.msg || '操作失败');
        return;
      }

      const { data = [] } = response;
      yield put({
        type: 'save',
        payload: {
          conUserName: data[0] && data[0].userName,
          wechatList: data,
        },
      });
      if (data[0] && data[0].userName) {
        yield put({
          type: 'getChatList',
          payload: {
            conUserName: data[0] && data[0].userName,
          },
        });
      }
    },
  },
  reducers: {
    changeTableList(state, { payload }) {
      return { ...state, tableList: payload };
    },
    save(state, { payload }) {
      return { ...state, ...payload };
    },
    getMessageList(state, { payload }) {
      const { messageList } = payload;
      const concatMessageList = messageList.reverse().concat(state.messageList);
      return { ...state, messageList: concatMessageList };
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
