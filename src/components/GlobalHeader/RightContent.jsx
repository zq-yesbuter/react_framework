import { Icon, Tooltip } from 'antd';
import React from 'react';
import { connect } from 'dva';
import DynamicAntdTheme from 'dynamic-antd-theme';
import Avatar from './AvatarDropdown';
import styles from './index.less';

const GlobalHeaderRight = props => {
  const { theme, layout } = props;
  let className = styles.right;

  if (theme === 'dark' && layout === 'topmenu') {
    className = `${styles.right}  ${styles.dark}`;
  }

  return (
    <div className={className} style={{ marginRight: 20 }}>
      {/* <DynamicAntdTheme primaryColor='#77dd66'/> */}
      <Avatar />
    </div>
  );
};

export default connect(({ settings }) => ({
  theme: settings.navTheme,
  layout: settings.layout,
}))(GlobalHeaderRight);
