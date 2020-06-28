import request from '../utils/request';
import { stringify } from 'qs';

export async function queryCurrent() {
  return request('/operator');
}
