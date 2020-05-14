import React, { Fragment, useState, useEffect } from 'react';
import { connect } from 'dva';
import { Card, message, Button, Modal, Menu, Upload, Icon } from 'antd';
import classnames from 'classnames';
import queryString from 'query-string';
import { routerRedux } from 'dva/router';
import Detail from './Detail';
import styles from './index.less';

const { Dragger } = Upload;

function Index(props: Props) {
  const { dispatch, namelist, loading } = props;
  const { nameList, nameCur, namePageSize, nameRequest, batchDetail, nameTotal } = namelist;
  const { search } = window.location;
  const [ detail,setDetail ] = useState(false);

  const uploadProps: any = {
    name: 'file',
    multiple: false,
    action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
    onChange(info: any) {
      const { status } = info.file;
      if (status !== 'uploading') {
        console.log(info.file, info.fileList);
      }
      if (status === 'done') {
        message.success(`${info.file.name} 文件上传成功`);
      } else if (status === 'error') {
        message.error(`${info.file.name} 文件上传失败`);
      }
    },
  };
  return (
    <Card
      bordered={false}
      title={
        <Fragment>
          简历预览
          {detail && 
          <a
          href="javascript:;"
          style={{
            padding: '5px 15px',
            fontSize: 14,
          }}
          onClick={e => {
            e.preventDefault();
            setDetail(false)
          }}
        >
          返回上传简历界面
        </a>}
        </Fragment>
      }
    >
      <div style={{ height: '100%' }}>
        {!detail ? 
            <div className={styles['upload-div']}>
            <h1 className={styles['upload-div-header']}>简历解析体验</h1>
            <Dragger {...uploadProps}>
            <p className="ant-upload-drag-icon">
                <Icon type="inbox" />
            </p>
            <p
                className="ant-upload-text"
                style={{ color: '#32325d', fontSize: '22px', fontWeight: 600 }}
            >
                点击或拖拽
            </p>
            <p className="ant-upload-hint" style={{ color: '#32325d', fontSize: 18 }}>
                即可上传简历文件
            </p>
            </Dragger>
            <div style={{textAlign:'center',marginTop:30}}>
            <Button type="primary" onClick={() => {setDetail(true)}}>开始解析</Button>
            </div>
        </div>: 
        <Detail/>
        }
        
      </div>
    </Card>
  );
}

export default connect(({ namelist }) => {
  return {
    namelist,
  };
})(Index);
