import { parse } from 'querystring';
import moment from 'moment';
/* eslint no-useless-escape:0 import/prefer-default-export:0 */

const reg = /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(?::\d+)?|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/;
export const isUrl = path => reg.test(path);
export const getPageQuery = () => parse(window.location.href.split('?')[1]);

export const jsonReplacer = (key, value) =>
  value === '' || value === undefined || value === null ? undefined : value;

/* 计算相对时间 */
export const calchandleRelativeDate = type => {
  const nowDate = moment();
  let day = nowDate.day();
  day = (day === 0 ? 7 : day) - 1;
  const date = nowDate.date();
  let startDate = null;
  let endDate = null;

  switch (type) {
    case 'today':
      startDate = nowDate.format('YYYY-MM-DD');
      endDate = startDate;
      break;
    case 'yesterday':
      startDate = nowDate.subtract(1, 'days').format('YYYY-MM-DD');
      endDate = startDate;
      break;
    case 'thisweek':
      endDate = nowDate.format('YYYY-MM-DD');
      startDate = nowDate.subtract(day, 'days').format('YYYY-MM-DD');
      // endDate = nowDate.add(6, 'days').format('YYYY-MM-DD');
      break;
    case 'lastweek':
      endDate = nowDate.subtract(day + 1, 'days').format('YYYY-MM-DD');
      startDate = nowDate.subtract(6, 'days').format('YYYY-MM-DD');
      break;
    case 'thismonth':
      endDate = nowDate.format('YYYY-MM-DD');
      startDate = nowDate.subtract(date - 1, 'days').format('YYYY-MM-DD');
      // endDate = nowDate.add(1, 'month').subtract(1, 'days').format('YYYY-MM-DD');
      break;
    case 'lastmonth':
      endDate = nowDate.subtract(date, 'days').format('YYYY-MM-DD');
      startDate = nowDate
        .add(1, 'days')
        .subtract(1, 'month')
        .format('YYYY-MM-DD');
      break;
    default:
  }

  return { startDate, endDate };
};
/* 计算相对时间, 以逗号分割 */
export const getDateString = value => {
  const { startDate, endDate } = calchandleRelativeDate(value);
  return `${startDate},${endDate}`;
};
export function flatten(arr) {
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
export const isAntDesignPro = () => {
  // eslint-disable-next-line no-undef
  if (ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION === 'site') {
    return true;
  }

  return window.location.hostname === 'preview.pro.ant.design';
}; // 给官方演示站点用，用于关闭真实开发环境不需要使用的特性
