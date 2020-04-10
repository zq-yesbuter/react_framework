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

// 获取外呼类型
export async function getIvrIntents(params) {
  return request('/ivr/intents', {
    method: 'GET',
  });
}

// 批次创建
export async function addBatch(body) {
  const {intent } = body;
  return request(`/batch/${intent}`, {
    method: 'POST',
    body,
  });
}

// 批次关联
export async function batchRelated(body) {
  const {intent, id } = body;
  return request(`/batch/${intent}/${id}/related`, {
    method: 'POST',
    body,
  });
}

// 批次取消
export async function batchCancel(body) {
  const {intent, id} = body;
  return request(`/batch/${intent}/${id}/cancel`, {
    method: 'POST',
    body,
  });
}

// 批次查询
export async function getBatch(body) {
  return request('/batch/all', {
    method: 'POST',
    body,
  });
}

// 上传
export async function upload(formData, urlParams) {
  return request(`/common/invitations?${stringify(urlParams)}`, {
    method: 'POST',
    body: formData,
  });
}
// 批次详情查询  getBatch,batchCancel
// export async function getBatch(body) {
//   return request('/batch/all', {
//     method: 'POST',
//     body,
//   });
// }
//  batch/{intent}/{id}/detail