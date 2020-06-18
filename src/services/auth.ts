import { stringify } from 'qs';
import request from '../utils/request';

// 创建公司
export async function createCompany(body) {
  return request(`/organization`, {
    method: 'POST',
    body,
  });
}

// 查部门结构
export async function fetchDepartment(params) {
  return request(`/organizations?${stringify(params)}`, {
    method: 'GET',
  });
}

// 创建子部门
export async function creactSub(body) {
  return request(`/organization/supervisor`, {
    method: 'POST',
    body,
  });
}

// 修改用户所属部门
export async function editDepartment(body) {
  return request('/organization/operator/tenant', {
    method: 'POST',
    body,
  });
}

// 新增用户
export async function addUser(body) {
  return request('/organization/operator', {
    method: 'POST',
    body,
  });
}

// 查看用户列表
export async function queryUser(params) {
  return request(`/operators?${stringify(params)}`, {
    method: 'GET',
  });
}

// 转换自己的权限
export async function transform(body) {
  return request('/organization/operator/tenant', {
    method: ' POST',
    body,
  });
}