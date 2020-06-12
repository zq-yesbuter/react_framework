import React from 'react';
import Header from './Header';
import BasicContent from './BasicContent';
import EducationContent from './EducationContent';
import WorkContent from './WorkContent';
import ProjectContent from './ProjectContent';
// import user from '@/assets/user.svg';
import './Detail.less';

function Detail({ resume }: { resume: any }) {
  return (
    <div className="detail-div">
      <div className="resume">
        <div style={{ textAlign: 'center' }}>
          <img
            src={require('@/assets/user.svg')}
            alt="avatar"
            style={{ width: '20', borderRadius: 10 }}
          />
        </div>
        <Header title="基本信息" />
        <BasicContent {...resume} />
        <Header title="教育背景" />
        <EducationContent {...resume} />
        <Header title="工作经历" />
        <WorkContent {...resume} />
        <Header title="项目经历" />
        <ProjectContent {...resume} />
      </div>
    </div>
  );
}

export default Detail;
