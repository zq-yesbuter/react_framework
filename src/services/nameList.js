import { stringify } from 'qs';
import request from '../utils/request';

// 名单信息
export async function jobAppliedAsPostAll(params) {
  return request(`/tenant/job/applicants/all?${stringify(params)}`, {
    method: 'GET',
    ignoreError: true,
  });
}

// 消息记录信息查询
export async function fetchMessage(params) {
  return request(`/messages?${stringify(params)}`, {
    method: 'GET',
  });
}
