import { stringify } from 'qs';
import request from '../utils/request';

// 批次查询
export async function getBatch(body: any) {
  return request('/batch/all', {
    method: 'POST',
    body,
  });
}
