import { stringify } from 'qs';
import request from '../utils/request';

// 岗位创建
export async function addJob(body) {
  return request('/tenant/job', {
    method: 'POST',
    body,
  });
}

// 岗位信息查询
export async function queryJobs(props) {
  return request('/api/tenant/jobs', {
    method: 'GET',
  });
}

// 岗位信息查询
export async function queryInformation(params) {
  return request(`/tenant/jobs/all/${stringify(params)}`, {
    method: 'GET',
  });
}

// 岗位创建
export async function createJob(body) {
  return request('/job', {
    method: 'POST',
    body,
  });
}

// 岗位信息查询
export async function resolveRobotFeatures({ jobId }) {
  return request(`/job/${jobId}`, {
    method: 'GET',
  });
}

// 查询所有简历
export async function fetchAllResume(params) {
  return request(`/resumes?${stringify(params)}`, {
    method: 'GET',
  });
}

// 查询简历信息
export async function fetchResume({ resumeId }) {
  return request(`/api/resume/${resumeId}`, {
    method: 'GET',
  });
}

// 通过已入库的简历申请岗位
export async function jobApply(body) {
  return request('/tenant/job/apply', {
    method: 'POST',
    body,
  });
}

// 通过标准格式的新简历申请岗位
export async function jobApplyAsNewResume(body) {
  return request('/tenant/job/apply/resume', {
    method: 'POST',
    body,
  });
}

// 通过文件简历申请岗位
export async function jobApplyAsFile(body) {
  return request('/tenant/job/apply/resume/attachment', {
    method: 'POST',
    body,
  });
}

// 查询已申请的简历信息
export async function jobApplied(params) {
  return request(`/tenant/resumes/all?${stringify(params)}`, {
    method: 'GET',
  });
}

// 查询岗位下申请信息
export async function jobAppliedAsPost(params) {
  return request(`/tenant/job/applicants?${stringify(params)}`, {
    method: 'GET',
  });
}

// 查询岗位下申请信息所有
export async function jobAppliedAsPostAll(params) {
  return request(`/api/tenant/job/applicants/all?${stringify(params)}`, {
    method: 'GET',
  });
}

// 邀约申请
export async function addInvitation(body) {
  return request('/api/interview/invitation', {
    method: 'POST',
    body,
  });
}

// 邀约信息修改
export async function editInvitation(body) {
  const { updateId } = body;
  return request(`/api/interview/invitation/${updateId}`, {
    method: 'POST',
    body,
  });
}

// 邀约信息查询
export async function fetchInvitation(params) {
  return request(`/api/interview/invitation?${stringify(params)}`, {
    method: 'GET',
  });
}

// 消息记录信息查询
export async function fetchMessage(params) {
  return request(`api/messages?${stringify(params)}`, {
    method: 'GET',
  });
}

// 账号鉴权
export async function auth(body) {
  return request('/authenticate', {
    method: 'POST',
    body,
  });
}

// 创建公司以及操作人员
export async function authenticate(body) {
  return request('/url/authenticate', {
    method: 'POST',
    body,
  });
}

// 创建部门以及操作人员
export async function supervisor(body) {
  return request('/url/organization/supervisor', {
    method: 'POST',
    body,
  });
}

// 创建操作人员
export async function operator(body) {
  return request('/url/organization/operator', {
    method: 'POST',
    body,
  });
}

// 修改操作人员信息
export async function operatorPersonnel(body) {
  const { id } = body;
  return request(`url/organization/operator/${id}`, {
    method: 'POST',
    body,
  });
}
