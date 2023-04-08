import React from 'react';
import styles from './Progress.module.css';

const Progress = ({ percent }) => {
  return (
    <div className={styles.outer}>
      <div className={styles.inner} style={{ width: `${percent}%` }} ></div>
    </div>
  )
};

export default Progress;