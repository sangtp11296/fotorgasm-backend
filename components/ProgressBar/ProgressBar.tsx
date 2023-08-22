import React from 'react'
import styles from './ProgressBar.module.css'

type Props = {
    progress: number
}
export const ProgressBar: React.FC<Props> = ({ progress }) => {
  return (
    <div className={styles.progressBarContainer}>
      <div
        className={styles.progressBar}
        style={{ width: `${progress}%` }}
      ></div>
    </div>
  )
}
