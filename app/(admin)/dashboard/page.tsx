'use client'

import React, { useState } from 'react'
import styles from './Dashboard.module.css'
import MenuContainer from '@/components/Dashboard/MenuContainer/MenuContainer'
import HeaderContainer from '@/components/Dashboard/HeaderContainer/HeaderContainer'
import TeamContainer from '@/components/Dashboard/TeamContainer/TeamContainer'
import PostSum from '@/components/Dashboard/PostsSum/PostSum'
import ChatNoti from '@/components/Dashboard/ChatNoti/ChatNoti'

import { useSession } from "next-auth/react";
import { useRouter } from 'next/navigation'

// Generate props for MenuContainer


const Dashboard = () => {
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
  function handlePostMenu(data: string) {
    setMenuType(data);
  }
  if (session.status === 'authenticated' && session.data.user?.name === 'fotorgasm'){
    return (
      <div className={styles.dashboard}>
          <div className={styles.dashboardWrapper}>
              <MenuContainer postMenu={handlePostMenu}/>
              <HeaderContainer user={session.data.user}/>
              <PostSum menuType={menuType}/>
              <TeamContainer/>
              <ChatNoti/>
          </div>
      </div>
    ) 
  } else return router.push('/');
}

export default Dashboard