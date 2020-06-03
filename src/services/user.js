import request from '../utils/request';
import { stringify } from 'qs';

export async function query() {
  return request('/api/users');
}

export async function queryCurrent() {
  return request('/operator', {
    method: 'GET',
  });
}

export async function loginOut() {
  return request('/api/login/out');
}

export async function queryMenu(props) {
  return request(`/api/menu/list?${stringify(props)}`);
}

export async function queryRobotList() {
  return request('/api/robot/config/robot/list', {
    method: 'POST',
  });
}

export async function selectRobot(props) {
  return request('/api/robot/config/robot/select', {
    method: 'POST',
    body: props,
  });
}

// 获取首页满意度
export async function homePageFetchData(props) {
  return request('/api/robot/dashboard/terminal/lastDay/list', {
    method: 'POST',
    body: props,
  });
}
