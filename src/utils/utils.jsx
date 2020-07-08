import moment from 'moment';
import _ from 'lodash';

export function fixedZero(val) {
  return val * 1 < 10 ? `0${val}` : val;
}

export function dateDiff(startDate, endDate) {
  let diff = endDate - startDate; // 时间差的毫秒数

  // 计算出相差天数
  let days = Math.floor(diff / (24 * 3600 * 1000));

  // 计算出小时数
  let leave1 = diff % (24 * 3600 * 1000); // 计算天数后剩余的毫秒数
  let hours = Math.floor(leave1 / (3600 * 1000));
  // 计算相差分钟数
  let leave2 = leave1 % (3600 * 1000); // 计算小时数后剩余的毫秒数
  let minutes = Math.floor(leave2 / (60 * 1000));

  // 计算相差秒数
  let leave3 = leave2 % (60 * 1000); // 计算分钟数后剩余的毫秒数
  let seconds = Math.round(leave3 / 1000);

  let returnStr = `${seconds}秒`;
  if (minutes > 0) {
    returnStr = `${minutes}分${returnStr}`;
  }
  if (hours > 0) {
    returnStr = `${hours}小时${returnStr}`;
  }
  if (days > 0) {
    returnStr = `${days}天${returnStr}`;
  }
  return returnStr;
}

export function getTimeDistance(type) {
  const now = new Date();
  const oneDay = 1000 * 60 * 60 * 24;

  if (type === 'today') {
    now.setHours(0);
    now.setMinutes(0);
    now.setSeconds(0);
    return [moment(now), moment(now.getTime() + (oneDay - 1000))];
  }

  if (type === 'week') {
    let day = now.getDay();
    now.setHours(0);
    now.setMinutes(0);
    now.setSeconds(0);

    if (day === 0) {
      day = 6;
    } else {
      day -= 1;
    }

    const beginTime = now.getTime() - day * oneDay;

    return [moment(beginTime), moment(beginTime + (7 * oneDay - 1000))];
  }

  if (type === 'month') {
    const year = now.getFullYear();
    const month = now.getMonth();
    const nextDate = moment(now).add(1, 'months');
    const nextYear = nextDate.year();
    const nextMonth = nextDate.month();

    return [
      moment(`${year}-${fixedZero(month + 1)}-01 00:00:00`),
      moment(moment(`${nextYear}-${fixedZero(nextMonth + 1)}-01 00:00:00`).valueOf() - 1000),
    ];
  }

  if (type === 'year') {
    const year = now.getFullYear();

    return [moment(`${year}-01-01 00:00:00`), moment(`${year}-12-31 23:59:59`)];
  }
}

export function getPlainNode(nodeList, parentPath = '') {
  const arr = [];
  nodeList.forEach(node => {
    const item = node;
    item.path = `${parentPath}/${item.path || ''}`.replace(/\/+/g, '/');
    item.exact = true;
    if (item.children && !item.component) {
      arr.push(...getPlainNode(item.children, item.path));
    } else {
      if (item.children && item.component) {
        item.exact = false;
      }
      arr.push(item);
    }
  });
  return arr;
}

export function digitUppercase(n) {
  const fraction = ['角', '分'];
  const digit = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖'];
  const unit = [['元', '万', '亿'], ['', '拾', '佰', '仟']];
  let num = Math.abs(n);
  let s = '';
  fraction.forEach((item, index) => {
    s += (digit[Math.floor(num * 10 * 10 ** index) % 10] + item).replace(/零./, '');
  });
  s = s || '整';
  num = Math.floor(num);
  for (let i = 0; i < unit[0].length && num > 0; i += 1) {
    let p = '';
    for (let j = 0; j < unit[1].length && num > 0; j += 1) {
      p = digit[num % 10] + unit[1][j] + p;
      num = Math.floor(num / 10);
    }
    s = p.replace(/(零.)*零$/, '').replace(/^$/, '零') + unit[0][i] + s;
  }

  return s
    .replace(/(零.)*零元/, '元')
    .replace(/(零.)+/g, '零')
    .replace(/^整$/, '零元整');
}

function getRelation(str1, str2) {
  if (str1 === str2) {
    console.warn('Two path are equal!'); // eslint-disable-line
  }
  const arr1 = str1.split('/');
  const arr2 = str2.split('/');
  if (arr2.every((item, index) => item === arr1[index])) {
    return 1;
  } else if (arr1.every((item, index) => item === arr2[index])) {
    return 2;
  }
  return 3;
}

function getRenderArr(routes) {
  let renderArr = [];
  renderArr.push(routes[0]);
  for (let i = 1; i < routes.length; i += 1) {
    let isAdd = false;
    // 是否包含
    isAdd = renderArr.every(item => getRelation(item, routes[i]) === 3);
    // 去重
    renderArr = renderArr.filter(item => getRelation(item, routes[i]) !== 1);
    if (isAdd) {
      renderArr.push(routes[i]);
    }
  }
  return renderArr;
}

/**
 * Get router routing configuration
 * { path:{name,...param}}=>Array<{name,path ...param}>
 * @param {string} path
 * @param {routerData} routerData
 */
export function getRoutes(path, routerData) {
  let routes = Object.keys(routerData).filter(
    routePath => routePath.indexOf(path) === 0 && routePath !== path
  );
  // Replace path to '' eg. path='user' /user/name => name
  routes = routes.map(item => item.replace(path, ''));
  // Get the route to be rendered to remove the deep rendering
  const renderArr = getRenderArr(routes);
  // Conversion and stitching parameters
  const renderRoutes = renderArr.map(item => {
    const exact = !routes.some(route => route !== item && getRelation(route, item) === 1);
    return {
      exact,
      ...routerData[`${path}${item}`],
      key: `${path}${item}`,
      path: `${path}${item}`,
    };
  });
  return renderRoutes;
}

/* eslint no-useless-escape:0 */
const reg = /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/;

export function isUrl(path) {
  return reg.test(path);
}

export function formatPayload(payload) {
  for (let key in payload) {
    if ({}.hasOwnProperty.call(payload, key)) {
      payload[key] = payload[key] === '' ? null : payload[key];
    }
  }
  return payload;
}

// 格式化标注与审核数据

export function formatLabelData(item) {
  try {
    if (item.answer) {
      item.answer = JSON.parse(item.answer);
      item.answer.score = Math.floor(item.answer.score * 100) / 100;
      item.moreAnswer = item.answer.more;
    }
    if (item.labelStatus) {
      item.labelStatus = JSON.parse(item.labelStatus);
    }
    if (item.auditLabel) {
      item.auditLabel = JSON.parse(item.auditLabel);
    }
    if (!item.extendRemark) {
      item.extendRemark = [''];
    } else {
      item.extendRemark = item.extendRemark.split(';');
    }
    if (item.extAnswers) {
      let tempExtAnswers = JSON.parse(item.extAnswers);
      let extAnswersProxy = [];
      for (let i = 0, len = tempExtAnswers.length; i < len; i++) {
        let tempAnswers = JSON.parse(tempExtAnswers[i].answers),
          answerProxy = {};

        if (tempAnswers.more) {
          answerProxy = {
            type: tempExtAnswers[i].answerModelProperties.replyType,
            answers: tempAnswers.more,
            answer: tempAnswers.answer,
          };
        } else if (tempAnswers.properties) {
          const answers = [];

          tempAnswers.properties.forEach(i => {
            if (i.value) {
              const v = typeof i.value === 'string' ? [i.value] : i.value;
              v instanceof Array && answers.push(...v);
            }
          });

          answerProxy = {
            type: tempExtAnswers[i].answerModelProperties.replyType,
            answers,
          };
        }

        extAnswersProxy.push(answerProxy);
      }
      item.extAnswersProxy = extAnswersProxy;
    }
  } catch (e) {
    console.log(e);
  }
  return item;
}

export function formatTaskType(ivrIntents, key, keyValue, value) {
  const ivrValue = ivrIntents && ivrIntents.find(e => e[key] === keyValue) || {};
  return ivrValue && Object.keys(ivrValue).length ? ivrValue[value] : null
}

export function formatNameType(ivrIntents, key, keyValue, value, record) {
  const { operator, appCode } = record;
  const ivrValue = ivrIntents && ivrIntents.find(e => e[key] === keyValue) || {};
  return ivrValue && Object.keys(ivrValue).length ? (operator === appCode && keyValue !== '0' && appCode ? `${ivrValue[value]}(重复外呼)` : ivrValue[value]) : null
}

export function objToArrObj(obj) {
  let arr = [];
  for(let i in obj){
    arr.push({[i]:obj[i]})
  }
  return arr;
}

export function formatTree(departList = []) {
  const cloneList = _.cloneDeep(departList);
  const idMapping = cloneList.reduce((acc, el, i) => {
    acc[el.id] = i;
    return acc;
  }, {});
  let root = {};
  cloneList.forEach(el => {
    // 判断根节点
    if (!el.parentId) {
      root = el;
      return;
    }
    // 用映射表找到父元素
    const parentEl = cloneList[idMapping[el.parentId]] || {};
    // 把当前元素添加到父元素的`children`数组中
    parentEl.children = [...(parentEl.children || []), el];
  });
  return root;
}

export const equals = (a, b) => {
  if (a === b) return true;
  if (a instanceof Date && b instanceof Date) return a.getTime() === b.getTime();
  if (!a || !b || (typeof a !== 'object' && typeof b !== 'object')) return a === b;
  if (a.prototype !== b.prototype) return false;
  let keys = Object.keys(a);
  if (keys.length !== Object.keys(b).length) return false;
  return keys.every(k => equals(a[k], b[k]));
};
