import fetch from 'dva/fetch';
import { notification, message } from 'antd';
import { parse, stringify } from 'qs';
import { routerRedux } from 'dva/router';

const codeMessage = {
  200: '服务器成功返回请求的数据。',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）。',
  204: '删除数据成功。',
  400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
  401: '用户没有权限（令牌、用户名、密码错误）。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。',
};
function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }
  const errortext = codeMessage[response.status] || response.statusText;
  // notification.error({
  //   message: `请求错误 ${response.status}: ${response.url}`,
  //   description: errortext,
  // });
  const error = new Error(errortext);
  error.name = response.status;
  error.response = response;
  throw error;
}

/**
 * 校验请求结果
 * @param {} response
 */
function checkResult(response, options) {
  if (response.code === 0 || response.success) {
    return response.data;
  } else if (response.code === 'NOT_LOGIN') {
    const error = new Error('未登录');
    error.name = 401;
    error.response = response;
    throw error;
  }
  const message = response.message || response.msg || '未知错误';
  if (!options.ignoreError) {
    notification.error({
      message: '服务错误',
      description: `message:${message},code:${response.code}`,
    });
  }
  // message.error(`message:${message},code:${response.code}`);
  // const error = new Error(message);
  // error.name = 200;
  // error.response = response;
  // error.code = response.code;
  // throw error;
}
// try {
//   await request().catch((e)=>{console.log(e.code)})
// }catch (e){
//
// }

/**
 * Requests a URL, returning a promise.
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"
 * @return {object}           An object containing either "data" or "err"
 */
export default function request(url, options) {
  const defaultOptions = {
    ignoreError: false,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'X-Requested-With': 'XMLHttpRequest',
    },
  };
  const newOptions = { ...defaultOptions, ...options };
  if (newOptions.method === 'POST' || newOptions.method === 'PUT') {
    if (!(newOptions.body instanceof FormData)) {
      newOptions.headers = {
        Accept: 'application/json',
        'Content-Type': 'application/json; charset=utf-8',
        ...newOptions.headers,
      };
      newOptions.body = JSON.stringify(newOptions.body);
    } else {
      // newOptions.body is FormData
      newOptions.headers = {
        Accept: 'application/json',
        // 'Content-Type': 'multipart/form-data',
      };
    }
  }

  return fetch(url, newOptions)
    .then(checkStatus)
    .then(response => {
      if (newOptions.method === 'DELETE' || response.status === 204) {
        return response.text();
      }
      return response.json();
    })
    .then(res => {
      return checkResult(res, newOptions);
    })
    .catch(e => {
      const status = e.name;
      if (status === 401) {
        loginRedirect();
        return;
      }
      if (status === 403) {
        const reg = /^\?error/;
        if (reg.test(location.search)) {
          // eslint-disable-next-line no-underscore-dangle
          window.g_app._store.dispatch(routerRedux.push('/403'));
          return;
        }
        loginRedirect();
        return;
      }
      // if (status <= 504 && status >= 500) {
      //   // eslint-disable-next-line no-underscore-dangle
      //   window.g_app._store.dispatch(routerRedux.push('/500'));
      //   return;
      // }
      // if (status >= 404 && status < 422) {
      //   // eslint-disable-next-line no-underscore-dangle
      //   window.g_app._store.dispatch(routerRedux.push('/404'));
      //   return;
      // }
      throw e;
    });
}

export function loginRedirect() {
  const returnUrl = `/authenticate/erp?callback=${encodeURIComponent(`${location.origin}/AI`)}`;
  window.location.href = returnUrl;
}
