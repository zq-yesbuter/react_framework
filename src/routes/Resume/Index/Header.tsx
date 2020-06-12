import React from 'react';
import './Detail.less';

function Header({ title }: { title: string }) {
  return (
    <div className="resume-section-header">
      <div className="small-line-left" />
      <h4 className="section-word">{title}</h4>
      <div className="small-line-right" />
    </div>
  );
}

export default Header;
