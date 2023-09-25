import React from 'react'
import styles from './SkeletonLoading.module.css'

export const SkeletonLoading = () => {
  return (
    <>
        <div className={`${styles.skeletonItem} ${styles.portrait}`}>
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
        <div className={`${styles.skeletonItem} ${styles.landscape}`}>
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
        <div className={`${styles.skeletonItem} ${styles.square}`}>
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
