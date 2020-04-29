import { stringify } from 'qs';
import request from '../utils/request';

// 图片上传
export async function imageUpload(body) {
  return request('/image/upload', {
    method: 'POST',
    body,
  });
}

// 配置批量创建
export async function configBatch(body) {
  const { configType } = body;
  return request(`/config/${configType}/batch`, {
    method: 'POST',
    body,
  });
}



// 消息记录信息查询
export async function fetchMessage(params) {
  return request(`/messages?${stringify(params)}`, {
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
// 上传
export async function upload({ formData, params }) {
  const { intent, scene } = params;
  return request(`/${intent}/excel?${stringify({ intent, scene })}`, {
    method: 'POST',
    body: formData,
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
