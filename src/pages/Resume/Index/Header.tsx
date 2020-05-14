import React from 'react';
import styles from './Detail.less';

function Header({ title }: { title: string }) {
  return (
    <div className={styles['resume-section-header']}>
      <div className={styles['small-line-left']}></div>
      <h4 className={styles['section-word']}>{title}</h4>
      <div className={styles['small-line-right']}></div>
    </div>
  );
}

export default Header;
