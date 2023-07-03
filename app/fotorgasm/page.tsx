import React from 'react'
import styles from './Dashboard.module.css'
import MenuContainer from '@/components/Dashboard/MenuContainer/MenuContainer'

const Dashboard = () => {
  return (
    <div className={styles.dashboard}>
        <div className={styles.dashboardWrapper}>
            <MenuContainer/>
        </div>
    </div>
  )
}

export default Dashboard