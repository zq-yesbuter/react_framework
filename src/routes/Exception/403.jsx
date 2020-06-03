import { Button, Result } from 'antd';
import React from 'react';

const NoFoundPage = () => (
  <Result
    status="403"
    title="403"
    subTitle="登录错误了！你需要的权限有问题，请联系管理员哦～"
    extra={
      <Button
        type="primary"
        onClick={() => {
          const logoutUrl = `/authenticate/erp/logout?callback=${encodeURIComponent(
            `${location.origin}/AI`
          )}`;
          window.location.href = logoutUrl;
        }}
      >
        重新登录
      </Button>
    }
  />
);

export default NoFoundPage;
