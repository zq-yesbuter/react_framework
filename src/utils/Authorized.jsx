import RenderAuthorized from '../components/Authorized';
import { getAuthority } from './authority';

let Authorized = RenderAuthorized(getAuthority()); // eslint-disable-line

// Reload the rights component
const reloadAuthorized = () => {
  Authorized = RenderAuthorized(getAuthority());
};

// 控制可展示的非登录页面
const nonLoginAuthorized = pathname => {
  const notLoginList = ['/home', '/interface/api/fesco'];
  return ~notLoginList.indexOf(pathname);
};

export { reloadAuthorized, nonLoginAuthorized };
export default Authorized;
