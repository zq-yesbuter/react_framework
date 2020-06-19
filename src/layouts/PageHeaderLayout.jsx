import React from 'react';
import { Link } from 'dva/router';
import classnames from 'classnames';
import PageHeader from '../components/PageHeader';
import './PageHeaderLayout.less';

export default ({ children, wrapperClassName, top, ...restProps }) => {
  console.log('restPorps===>',restPorps);
  return (
    <div
      style={{ margin: '-24px -24px 0' }}
      className={classnames(wrapperClassName, 'page-header-layout')}
    >
      {top}
      <PageHeader key="pageheader" {...restProps} linkElement={Link} />
      {children ? <div className="content">{children}</div> : null}
    </div>
  );
} 
