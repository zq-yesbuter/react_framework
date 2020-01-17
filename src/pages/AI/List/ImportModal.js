import React, { useState, useEffect, Fragment, useRef } from 'react';
import { List, Modal, Upload, Tabs } from 'antd';
import { connect } from 'dva';
import _ from 'lodash';
import { resumeApplyAsFile } from '@/services/ai';
import FileUpload from './FileUpload';
import ResumeUpload from './ResumeUpload';
import styles from './index.less';

const { TabPane } = Tabs;
function ImportModal(props) {
  const [tabKey, setTabKey] = useState('1');
  const fileRef = useRef();
  const resumeRef = useRef();

  function handleOk() {
    // changeVal就是子组件暴露给父组件的方法
    if (tabKey === '1') {
      resumeRef.current.handleOk();
      return;
    }
    fileRef.current.handleOk();
    // setTabKey('1');
  }
  function handleCancel() {
    if (tabKey === '1') {
      resumeRef.current.handleCancel();
      return;
    }
    fileRef.current.handleCancel();
    setTabKey('1');
  }

  return (
    <Modal
      title="导入"
      // eslint-disable-next-line react/destructuring-assignment
      visible={props.visible}
      onOk={handleOk}
      onCancel={handleCancel}
    >
      <Tabs activeKey={tabKey} onTabClick={e => setTabKey(e)} size="small">
        <TabPane tab="简历文件" key="1">
          <ResumeUpload {...props} resumeRef={resumeRef} />
        </TabPane>
        <TabPane tab="外呼文件" key="2">
          <FileUpload {...props} fileRef={fileRef} />
        </TabPane>
      </Tabs>
    </Modal>
  );
}
const mapStateToProps = ({ chatrecord = {} }) => ({ chatrecord });
export default connect(mapStateToProps)(ImportModal);
