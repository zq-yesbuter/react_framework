import { stringify } from 'qs';
import request from '../utils/request';

// 消息记录信息查询
export async function fetchMessage(params) {
  return request(`/messages?${stringify(params)}`, {
    method: 'GET',
  });
}

// 获取外呼类型
export async function getIvrIntents() {
  return request('/ivr/intents', {
    method: 'GET',
  });
}

// 批次创建
export async function addBatch(body) {
  const { intent } = body;
  return request(`/batch/${intent}`, {
    method: 'POST',
    body,
  });
}

// 批次关联
export async function batchRelated(body) {
  const { intent, id } = body;
  return request(`/batch/${intent}/${id}/related`, {
    method: 'POST',
    body,
  });
}

// 批次取消
export async function batchCancel(body) {
  const { intent, id } = body;
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
export async function upload({ formData, params }) {
  const { intent, scene } = params;
  return request(`/scene/${intent}/excel?${stringify({ intent, scene })}`, {
    method: 'POST',
    body: formData,
  });
}

// 批次详情查询
export async function getBatchDetail(body) {
  const { intent, id } = body;
  return request(`/batch/${intent}/${id}/detail`, {
    method: 'POST',
    body,
  });
}

// 沟通信息查询
export async function getFlowlist(body) {
  const { intent } = body;
  return request(`/scene/${intent}/all`, {
    method: 'POST',
    body,
  });
}

// 单个沟通信息查询
export async function getSigleFlowlist(body) {
  const { intent, id, dataStatus } = body;
  return request(`/scene/${intent}/${id}?${stringify({dataStatus})}`, {
    method: 'get',
  });
}

// 单个修改
export async function editSignel(body) {
  const { updateId, intent } = body;
  return request(`/scene/${intent}/${updateId}`, {
    method: 'POST',
    body,
  });
}

// 单个申请
export async function addSignel(body) {
  const { intent } = body;
  return request(`/scene/${intent}`, {
    method: 'POST',
    body,
  });
}

// 单个取消
export async function cancelSignel(body) {
  const { intent, updateId } = body;
  return request(`/scene/${intent}/cancel/${updateId}`, {
    method: 'POST',
    body,
  });
}

// 批量沟通申请
export async function batchAdd(body) {
  const { intent } = body;
  return request(`/scene/${intent}/batch`, {
    method: 'POST',
    body,
  });
}

// 批次批量删除
export async function batchDelete(body) {
  const { intent } = body;
  return request(`/batch/${intent}`, {
    method: 'DELETE',
    body,
  });
}

// 名单批量删除
export async function nameBatchDelete(body) {
  const { intent } = body;
  return request(`/scene/${intent}/batch`, {
    method: 'DELETE',
    body,
  });
}

// 批次详情结果查询
export async function getResult(body) {
  const { intent,id } = body;
  return request(`/batch/${intent}/${id}/detail/results`, {
    method: 'GET',
  });
}
