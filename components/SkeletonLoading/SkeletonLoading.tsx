import React from 'react'
import styles from './SkeletonLoading.module.css'

type Props = {
    format: string
}
export const SkeletonLoading: React.FC<Props> = ({ format }) => {
  return (
    <>
        <div className={`${styles.skeletonItem} ${styles.portrait} ${format === 'music' && styles.album}`}>
            <div className={styles.skeletonInfo}>
                <div className={`${styles.skeletonCat}`}>
                    <div className={styles.skeletonCatImage}></div>
                    <span></span>
                </div>
                <div className={styles.skeletonTitle}>
                </div>
                <div className={styles.skeletonDesc}>
                </div>
            </div>
        </div>
        <div className={`${styles.skeletonItem} ${styles.landscape} ${format === 'music' && styles.album}`}>
            <div className={styles.skeletonInfo}>
                <div className={`${styles.skeletonCat}`}>
                    <div className={styles.skeletonCatImage}></div>
                    <span></span>
                </div>
                <div className={styles.skeletonTitle}>
                </div>
                <div className={styles.skeletonDesc}>
                </div>
            </div>
        </div>
        <div className={`${styles.skeletonItem} ${styles.landscape} ${format === 'music' && styles.album}`}>
            <div className={styles.skeletonInfo}>
                <div className={`${styles.skeletonCat}`}>
                    <div className={styles.skeletonCatImage}></div>
                    <span></span>
                </div>
                <div className={styles.skeletonTitle}>
                </div>
                <div className={styles.skeletonDesc}>
                </div>
            </div>
        </div>
        <div className={`${styles.skeletonItem} ${styles.square} ${format === 'music' && styles.album}`}>
            <div className={styles.skeletonInfo}>
                <div className={`${styles.skeletonCat}`}>
                    <div className={styles.skeletonCatImage}></div>
                    <span></span>
                </div>
                <div className={styles.skeletonTitle}>
                </div>
                <div className={styles.skeletonDesc}>
                </div>
            </div>
        </div>
    </>
  )
}
