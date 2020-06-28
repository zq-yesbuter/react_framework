import { Avatar, Icon, Menu, Spin } from 'antd';
import { FormattedMessage } from 'umi-plugin-react/locale';
import React from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import HeaderDropdown from '../HeaderDropdown';
import styles from './index.less';

class AvatarDropdown extends React.Component {
  onMenuClick = event => {
    const { key } = event;

    if (key === 'logout') {
      const { dispatch } = this.props;

      const logoutUrl = `/authenticate/erp/logout?callback=${encodeURIComponent(
        `${location.origin}/AI`
      )}`;
      window.location.href = logoutUrl;

      return;
    }

    router.push(`/account/${key}`);
  };

  render() {
    const {
      currentUser = {
        avatar: '',
        name: '',
      },
      menu,
    } = this.props;
    const menuHeaderDropdown = (
      <Menu className={styles.menu} selectedKeys={[]} onClick={this.onMenuClick}>
        {/* {menu && (
          <Menu.Item key="center">
            <Icon type="user" />
            <FormattedMessage id="menu.account.center" defaultMessage="account center" />
          </Menu.Item>
        )}
        {menu && (
          <Menu.Item key="settings">
            <Icon type="setting" />
            <FormattedMessage id="menu.account.settings" defaultMessage="account settings" />
          </Menu.Item>
        )}
        {menu && <Menu.Divider />} */}

        <Menu.Item key="logout">
          <Icon type="logout" />
          退出登录
        </Menu.Item>
      </Menu>
    );
    return (
      <HeaderDropdown overlay={menuHeaderDropdown}>
        <span className={`${styles.action} ${styles.account}`}>
          <Icon type="user" style={{ color: '#1890FF', fontSize: 20, marginRight:5 }} />
          {/* <Avatar size="small" className={styles.avatar} src={currentUser.avatar} alt="avatar" /> */}
          <span className={styles.name}>{currentUser.name || '当前用户'}</span>
        </span>
      </HeaderDropdown>
    );
    // currentUser && currentUser.name ?) : (
    //   <Spin
    //     size="small"
    //     style={{
    //       marginLeft: 8,
    //       marginRight: 8,
    //     }}
    //   />
    // );
  }
}

export default connect(({ user }) => ({
  currentUser: user.currentUser,
}))(AvatarDropdown);
