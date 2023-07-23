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
// Define Info Post type
interface PostInfo {
  format: string,
  title: string,
  slug: string,
  author: string,
  category: string,
  description: string,
  tags: string[],
}
const Dashboard: React.FC<Props> = ({ previewPost }) => {
  const session = useSession();
  const router = useRouter();
  const [menuType, setMenuType] = useState<string>('')
  const [editor, setEditor] = useState<boolean>(false)
  const [postInfo, setPostInfo] = useState<PostInfo | null>(null);

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
  // Switch to editorMode
  function handleAddPost(value: boolean){
    setEditor(value)
  }
  console.log(postInfo, 'postInfo')
  if (session.status === 'authenticated'){
    return (
      <div className={styles.dashboard}>
          <div className={styles.dashboardWrapper}>
              <MenuContainer postMenu={handlePostMenu}/>
              <HeaderContainer user={session.data.user}/>
              <PostSum 
              menuType={menuType} 
              addPost={handleAddPost} 
              postInfo={(value) => setPostInfo((prev) => (
                prev ? { ...prev, ...value } : value
                ))}/>
              <TeamContainer user={session.data.user} editorMode={editor}/>
              <InteractiveComponent postInfo={postInfo} editorMode={editor}/>
          </div>
      </div>
    ) 
  }
}

export default Dashboard