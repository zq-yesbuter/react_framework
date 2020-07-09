import { stringify } from 'qs';
import request from '../utils/request';

// 基础指标统计
export async function getReport(params: any) {
  return request(`/rpt/scene/overview?${stringify(params)}`, {
    method: 'GET',
  });
}
// 场景指标统计
export async function getScene(params: any) {
  return request(`/rpt/scene?${stringify(params)}`, {
    method: 'GET',
  });
}
// 操作者指标统计
export async function getOperation(params: any) {
  return request(`/rpt/scene/operator?${stringify(params)}`, {
    method: 'GET',
  });
}
