'use client'

import React, { useState } from 'react'
import styles from './Dashboard.module.css'
import MenuContainer from '@/components/Dashboard/MenuContainer/MenuContainer'
import HeaderContainer from '@/components/Dashboard/HeaderContainer/HeaderContainer'
import TeamContainer from '@/components/Dashboard/TeamContainer/TeamContainer'
import PostSum from '@/components/Dashboard/PostsSum/PostSum'
import InteractiveComponent from '@/components/Dashboard/InteractiveComponent/InteractiveComponent'

import { useSession } from "next-auth/react";
import { useRouter } from 'next/navigation';



const Dashboard: React.FC = () => {
  const session = useSession();
  const router = useRouter();
  const [menuType, setMenuType] = useState<string>('')

  if  (session.status === 'loading'){
    return <p style={{color: 'white'}}>Loading...</p>
  }
  if (session.status === 'unauthenticated'){
    setTimeout(() => {
      router.push('/auth');
    }, 100)
  }
  // Switch menu post
  function handlePostMenu(data: string) {
    setMenuType(data);
  }
  if (session.status === 'authenticated'){
    return (
      <div className={styles.dashboard}>
          <div className={styles.dashboardWrapper}>
              <MenuContainer postMenu={handlePostMenu}/>
              <HeaderContainer user={session.data.user}/>
              <PostSum menuType={menuType}/>
              <TeamContainer/>
              <InteractiveComponent />
          </div>
      </div>
    ) 
  }
}

export default Dashboard