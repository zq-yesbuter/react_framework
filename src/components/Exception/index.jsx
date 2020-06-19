import React, { createElement } from 'react';
import classNames from 'classnames';
import { Button } from 'antd';
import config from './typeConfig';
import './index.less';

export default ({ className, linkElement = 'a', type, title, desc, img, actions, ...rest }) => {
  const pageType = type in config ? type : '404';
  const clsString = classNames('exception', className);
  return (
    <div className={clsString} {...rest}>
      <div className="imgBlock">
        <div
          className="imgEle"
          style={{ backgroundImage: `url(${img || config[pageType].img})` }}
        />
      </div>
      <div className="content">
        <h1>{title || config[pageType].title}</h1>
        <div className="desc">{desc || config[pageType].desc}</div>
        <div className="actions">
          {actions || (
            <div>
              {createElement(
                linkElement,
                {
                  to: '/',
                  href: '/',
                },
                <Button type="primary">返回首页</Button>
              )}
              <Button
                type="primary"
                style={{ marginLeft: 10 }}
                onClick={() => {
                  const logoutUrl = `/authenticate/erp/logout?callback=${encodeURIComponent(
                    `${location.origin}/AI`
                  )}`;
                  window.location.href = logoutUrl;
                }}
              >
                返回登录页
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
