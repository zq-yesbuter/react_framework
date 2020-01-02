import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { Button, message } from 'antd';
import { connect } from 'dva';
import _ from 'lodash';
import BasicContent from './BasicContent';
import WorkContent from './WorkContent';
import ProjectContent from './ProjectContent';
import EducationContent from './EducationContent';
import { inlineShowResume } from '@/services/ai';
import styles from './index.less';

function Resume({
  chatrecord: {
    resumeObj: { channel },
    selectJobId,
    jobList,
  },
}) {
  function header() {
    return (
      <div className={styles.header}>
        <h3>{`简历来源：${channel || '网络渠道'}`}</h3>
        <Button onClick={showResume}>查看原简历</Button>
      </div>
    );
  }
  function showResume() {
    const { resumeId } = jobList.find(item => item.applyId === selectJobId) || {};
    let iframe = document.createElement('iframe');
    iframe.id = 1;
    iframe.width = '100%';
    iframe.height = '100%';
    inlineShowResume({ resumeId })
      .then(res => {
        if (!res) return;
        const { attachmentFileName, attachmentUrl } = res;
        const a = document.createElement('a'); // 创建a标签
        a.setAttribute('href', attachmentUrl); // href链接
        a.click();
      })
      .catch(error => message.error(error.message));
  }

  return (
    <div>
      {header()}
      <BasicContent />
      <WorkContent />
      <ProjectContent />
      <EducationContent />
    </div>
  );
}

const mapStateToProps = ({ chatrecord = {} }) => ({ chatrecord });
export default connect(mapStateToProps)(Resume);
