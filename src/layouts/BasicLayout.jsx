import React from 'react';
import PropTypes from 'prop-types';
import { Layout, Spin } from 'antd';
import DocumentTitle from 'react-document-title';
import { connect } from 'dva';
import { Route, Redirect, Switch, routerRedux } from 'dva/router';
import { ContainerQuery } from 'react-container-query';
import classNames from 'classnames';
import { enquireScreen, unenquireScreen } from 'enquire-js';
import { RouteContext } from '@ant-design/pro-layout';
import GlobalHeader from '../components/GlobalHeader';
import SiderMenu from '../components/SiderMenu';
import NotFound from '../routes/Exception/404';
import { getRoutes } from '../utils/utils';
import Authorized, { nonLoginAuthorized } from '../utils/Authorized';
import { getMenuData } from '../common/menu';
import logo from '../assets/logo.svg';

const { Content, Header } = Layout;
const { AuthorizedRoute, check } = Authorized;

/**
 * 根据菜单取得重定向地址.
 */
const redirectData = [];
const getRedirect = item => {
  if (item && item.children) {
    if (item.children[0] && item.children[0].path) {
      redirectData.push({
        from: `${item.path}`,
        to: `${item.children[0].path}`,
      });
      item.children.forEach(children => {
        getRedirect(children);
      });
    }
  }
};
getMenuData().forEach(getRedirect);

/**
 * 获取面包屑映射
 * @param {Object} menuData 菜单配置
 * @param {Object} routerData 路由配置
 */
const getBreadcrumbNameMap = (menuData, routerData) => {
  const result = {};
  const childResult = {};
  for (const i of menuData) {
    if (!routerData[i.path]) {
      result[i.path] = i;
    }
    if (i.children) {
      Object.assign(childResult, getBreadcrumbNameMap(i.children, routerData));
    }
  }
  return Object.assign({}, routerData, result, childResult);
};

const query = {
  'screen-xs': {
    maxWidth: 575,
  },
  'screen-sm': {
    minWidth: 576,
    maxWidth: 767,
  },
  'screen-md': {
    minWidth: 768,
    maxWidth: 991,
  },
  'screen-lg': {
    minWidth: 992,
    maxWidth: 1199,
  },
  'screen-xl': {
    minWidth: 1200,
  },
};

let isMobile;
enquireScreen(b => {
  isMobile = b;
});

class BasicLayout extends React.PureComponent {
  static childContextTypes = {
    location: PropTypes.object,
    breadcrumbNameMap: PropTypes.object,
  };
  state = {
    isMobile,
  };
  getChildContext() {
    const { location, routerData } = this.props;
    return {
      location,
      breadcrumbNameMap: getBreadcrumbNameMap(getMenuData(), routerData),
    };
  }
  componentDidMount() {
    const { location: { pathname }, dispatch, currentUser } = this.props;
    const nonLogin = nonLoginAuthorized(pathname);
    this.enquireHandler = enquireScreen(mobile => {
      this.setState({
        isMobile: mobile,
      });
    });

    if (!nonLogin) {
      // dispatch({
      //   type: 'user/fetchCurrent',
      // });
      //
    }
  }
  componentWillUnmount() {
    unenquireScreen(this.enquireHandler);
  }
  getPageTitle() {
    const { routerData, location } = this.props;
    const { pathname } = location;
    let title = 'AI招聘系统';
    if (routerData[pathname] && routerData[pathname].name) {
      title = `${routerData[pathname].name} - AI招聘系统`;
    }
    return title;
  }
  getBashRedirect = () => {
    // 这里是重定向的,重定向到 url 的 redirect 参数所示地址
    const urlParams = new URL(window.location.href);

    const redirect = urlParams.searchParams.get('redirect');
    // Remove the parameters in the url
    if (redirect) {
      urlParams.searchParams.delete('redirect');
      window.history.replaceState(null, 'redirect', urlParams.href);
    } else {
      const { routerData } = this.props;
      // get the first authorized route path in routerData
      const authorizedPath = Object.keys(routerData).find(
        item => check(routerData[item].authority, item) && item !== '/'
      );
      return authorizedPath;
    }
    return redirect;
  };

  handleMenuCollapse = collapsed => {
    this.props.dispatch({
      type: 'global/changeLayoutCollapsed',
      payload: collapsed,
    });
  };
  handleMenuClick = ({ key }) => {
    const { dispatch, location: { pathname } } = this.props;
    if (key === 'logout') {
      const logoutUrl = `/authenticate/erp/logout?callback=${encodeURIComponent(
        `${location.origin}`
      )}`;
      window.location.href = logoutUrl;
      return;
      // const returnUrl = `/authenticate/erp?callback=${encodeURIComponent(`${location.origin}/AI`)}`;
      // window.location.href = returnUrl;
    } else {
      dispatch(
        routerRedux.push({
          pathname: routerConfig[key].path,
        })
      );
    }
  };

  // 是否显示用户头像菜单栏的流量控制
  handleShowSentinel = list => {
    return list.indexOf('/userMenu/sentinel') > -1;
  };
  render() {
    const {
      currentUser,
      collapsed,
      routerData,
      match,
      location,
      menuLoading,
      initLoading,
      menuList,
    } = this.props;
    if (initLoading) {
      return (
        <div
          style={{
            width: '100%',
            height: '100%',
            margin: 'auto',
            paddingTop: 50,
            textAlign: 'center',
          }}
        >
          <Spin size="large" />
        </div>
      );
    }

    const bashRedirect = this.getBashRedirect();
    const layout =
      <Layout>
        <SiderMenu
          logo={logo}
          // 不带Authorized参数的情况下如果没有权限,会强制跳到403界面
          Authorized={Authorized}
          menuData={getMenuData()}
          collapsed={collapsed}
          location={location}
          isMobile={this.state.isMobile}
          onCollapse={this.handleMenuCollapse}
        />
        <Layout>
          <Header style={{ padding: 0 }}>
            <GlobalHeader
              logo={logo}
              currentUser={currentUser}
              collapsed={collapsed}
              location={location}
              showSentinel={this.handleShowSentinel(menuList)}
              isMobile={this.state.isMobile}
              onCollapse={this.handleMenuCollapse}
              onMenuClick={this.handleMenuClick}
            />
          </Header>
          <Content>
            <Switch>
              {redirectData.map(item => (
                <Redirect key={item.from} exact from={item.from} to={item.to} />
              ))}
              {getRoutes(match.path, routerData).map(item => (
                <AuthorizedRoute
                  key={item.key}
                  path={item.path}
                  component={item.component}
                  exact={item.exact}
                  authority={item.authority}
                  redirectPath="/AI/403"
                />
              ))}
              <Redirect exact from="/" to={bashRedirect} />
              <Route render={NotFound} />
            </Switch>
          </Content>
        </Layout>
      </Layout>

    return (
      <DocumentTitle title={this.getPageTitle()}>
        <ContainerQuery query={query}>
          {params => <div className={classNames(params)}>{layout}</div>}
        </ContainerQuery>
      </DocumentTitle>
    );
  }
}

export default connect(({ user, global, loading }) => ({
  currentUser: user.currentUser,
  collapsed: global.collapsed,
  // menuLoading: loading.effects['user/fetchMenuList'],
  menuList: user.menuList,
}))(BasicLayout);