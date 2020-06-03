import moment from 'moment';

// export const baseUrl = 'http://nom.jd.com';
export const baseUrl = '';

// 权限编号
export const authApi = {
  admin: 0, // 超级管理员(所有权限)
  superManager: 1, // 管理员（权限管理，用户管理）
  manager: 2, // 一般管理员（用户管理）
  user: 3, // 普通用户理员
};

// 运营指标默认时间范围
export const defaultTime = `${moment()
  .subtract(7, 'days')
  .startOf('day')
  .format('YYYY-MM-DD HH:mm:ss')} - ${moment().format('YYYY-MM-DD HH:mm:ss')}`;

export const jsonReplacer = (key, value) =>
  value === '' || value === undefined || value === null ? undefined : value;

export const formatSubStr = (str = '', len = 14) =>
  str.length > len ? `${str.substr(0, len)}...` : str;

export const isJsonString = str => {
  try {
    JSON.parse(str);
    return true;
  } catch (e) {
    return false;
  }
};

/**
 *小数精度处理方法
 * accMul(小数, 保留几位小数)
 * accMul(0.2435, 100) // 24.35
 */
export function accMul(arg1, arg2) {
  let m = 0,
    s1 = arg1.toString(),
    s2 = arg2.toString();
  try {
    m += s1.split('.')[1].length;
  } catch (e) {
    m = 0;
  }
  try {
    m += s2.split('.')[1].length;
  } catch (e) {
    m = 0;
  }
  return Number(s1.replace('.', '')) * Number(s2.replace('.', '')) / 10 ** m;
}
