import { Button, Result } from 'antd';
import React from 'react';
import router from 'dva/router'; 

const NoFoundPage = () => (
  <Result
    status="404"
    title="404"
    subTitle="对不起，你访问的页面不存在～"
    extra={
      <Button type="primary" onClick={() => router.push('/')}>
        回到首页
      </Button>
    }
  />
);

export default NoFoundPage;