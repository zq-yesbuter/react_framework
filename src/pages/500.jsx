import { Button, Result } from 'antd';
import React from 'react';
import router from 'umi/router'; // 这里应该使用 antd 的 404 result 组件，
// 但是还没发布，先来个简单的。

const NoFoundPage = () => (
  <Result
    status="500"
    title="500"
    subTitle="服务器请求错误～"
    extra={
      <Button type="primary" onClick={() => router.push('/')}>
        回到首页
      </Button>
    }
  />
);

export default NoFoundPage;
