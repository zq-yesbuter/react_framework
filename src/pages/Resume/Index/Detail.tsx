import React from 'react';
import { connect } from 'dva';
import Header from './Header';
import BasicContent from './BasicContent';
import EducationContent from './EducationContent';
import WorkContent from './WorkContent';
import ProjectContent from './ProjectContent';
import user from '@/assets/user.svg';
import styles from './Detail.less';

function Detail() {
  return (
    <div className={styles['upload-div']}>
      <div className={styles.resume}>
        <div style={{textAlign:'center'}}>
          <img src={user} alt="avatar" style={{ width: '20', borderRadius: 10 }} />
        </div>
        <Header title="基本信息" />
        <BasicContent />
        <Header title="教育背景" />
        <EducationContent />
        <Header title="工作经历" />
        <WorkContent />
        <Header title="项目经历" />
        <ProjectContent />
      </div>
    </div>
  );
}

export default connect(({ namelist }) => {
  return {
    namelist,
  };
})(Detail);
