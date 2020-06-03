import React, { PureComponent } from 'react';
import { Menu, Icon, Spin, Dropdown, Avatar, Divider, List } from 'antd';
import Debounce from 'lodash-decorators/debounce';
import { Link } from 'dva/router';
import FormatSubStrTooltip from '../FormatSubStrTooltip';
import './index.less';
import { authApi } from '../../config';

export default class GlobalHeader extends PureComponent {
  state = {
    pageType: 'main',
  };
  componentDidMount() {
    const pathname = this.props.location.pathname;
    this.handleActiveMenu(pathname);
  }
  componentWillReceiveProps(nextProps) {
    const pathname = nextProps.location.pathname;
    if (this.props.location.pathname !== pathname) {
      this.handleActiveMenu(pathname);
    }
  }
  componentWillUnmount() {
    this.triggerResizeEvent.cancel();
  }
  handleActiveMenu(pathname) {
    this.setState({
      pageType: pathname === '/' || pathname === '/main' ? 'main' : 'robot',
    });
  }
  toggle = () => {
    const { collapsed, onCollapse } = this.props;
    onCollapse(!collapsed);
    this.triggerResizeEvent();
  };
  /* eslint-disable*/
  @Debounce(600)
  triggerResizeEvent() {
    const event = document.createEvent('HTMLEvents');
    event.initEvent('resize', true, false);
    window.dispatchEvent(event);
  }
  render() {
    const { currentUser = {}, collapsed, isMobile, logo, onMenuClick } = this.props;
    const { pageType } = this.state;
    const { roleType = null } = currentUser;
    const menu = (
      <Menu className="menu" selectedKeys={[]} onClick={onMenuClick}>
        <Menu.Item key="logout">
          <Icon type="logout" />退出登录
        </Menu.Item>
      </Menu>
    );

    return (
      <div className="header global-header">
        {isMobile && [
          <Link to="/" className="logo" key="logo">
            <img src={logo} alt="logo" width="32" />
          </Link>,
          <Divider type="vertical" key="line" />,
        ]}
        <Icon
          className="trigger"
          type={collapsed ? 'menu-unfold' : 'menu-fold'}
          onClick={this.toggle}
        />
        <div className="right">
          {currentUser.name ? (
            <Dropdown overlay={menu}>
              <span className="action account">
                {/*<Avatar icon="user" style={{color:'#1890FF'}}/>*/}
                <Icon type="user" style={{ color: '#1890FF', fontSize: 24 }} />
                <span className="name">{currentUser.name}</span>
              </span>
            </Dropdown>
          ) : (
            <Spin size="small" style={{ marginLeft: 8 }} />
          )}
        </div>
      </div>
    );
  }
}
