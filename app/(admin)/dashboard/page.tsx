'use client'

import React, { useState } from 'react'
import styles from './Dashboard.module.css'
import MenuContainer from '@/components/Dashboard/MenuContainer/MenuContainer'
import HeaderContainer from '@/components/Dashboard/HeaderContainer/HeaderContainer'
import TeamContainer from '@/components/Dashboard/TeamContainer/TeamContainer'
import PostSum from '@/components/Dashboard/PostsSum/PostSum'
import InteractiveComponent from '@/components/Dashboard/InteractiveComponent/InteractiveComponent'

import { useSession } from "next-auth/react";
import { useRouter } from 'next/navigation'
import { PreviewPost } from '@/types/Posts.type'

// Generate props for MenuContainer
interface Props {
  previewPost: PreviewPost
}

const Dashboard: React.FC<Props> = ({ previewPost }) => {
  const session = useSession();
  const router = useRouter();
  const [menuType, setMenuType] = useState<string>('')
  const [addPost, setAddPost] = useState<boolean>(false)
  const [finalPost, setFinalPost] = useState<PreviewPost | null>(null);
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
  // Switch to add post format
  function handleAddPost(value: boolean){
    setAddPost(value)
  }
  // Handle post info
  function handlePostInfo(newPost: any){
    // const merged = {...newPost};
    // setFinalPost(merged);
  }
  console.log(finalPost, 'finalPost')
  if (session.status === 'authenticated' && session.data.user?.name === 'fotorgasm'){
    return (
      <div className={styles.dashboard}>
          <div className={styles.dashboardWrapper}>
              <MenuContainer postMenu={handlePostMenu}/>
              <HeaderContainer user={session.data.user}/>
              <PostSum 
              menuType={menuType} 
              addPost={handleAddPost} 
              postInfo={(value) => setFinalPost((prev) => (
                prev ? { ...prev, ...value } : value
                ))}/>
              <TeamContainer switchEditor={addPost}/>
              <InteractiveComponent/>
          </div>
      </div>
    ) 
  } else {
    setTimeout(() => {
      router.push('/');
    }, 100)
  }
}

export default Dashboard