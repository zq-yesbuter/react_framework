import { stringify } from 'qs';
import request from '../utils/request';

// 上传
export async function upload(formData:any) {
    return request('/resume/attachments/analyse', {
      method: 'POST',
      body: formData,
    });
  }
  