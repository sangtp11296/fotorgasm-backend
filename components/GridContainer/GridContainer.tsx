'use client'
import React, { useEffect, useState } from 'react'
import styles from './GridContainer.module.css'
import { getPosts } from '@/utils/getPosts'
import { FetchedPost } from '@/types/Posts.type'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import ScrollToTop from '../ButtonIcon/ScrollToTop'
import { updateFetchedPost } from '@/redux/post/fetchPosts.slice'
import { PostFeed } from './PostFeed'
import { AlbumFeed } from './AlbumFeed'

const GridContainer: React.FC = () => {

  const [posts, setPosts] = useState<FetchedPost[]>([]);

  const dispatch = useAppDispatch();
  const menu = useAppSelector(state => state.click.mainMenu);

  // Get first time loading posts
  const handleGetPosts = async (format: string, page: number) => {
    const res = getPosts(format, page, 5);
    setPosts((await res).posts);
    // For next prev post function
    dispatch(updateFetchedPost((await res).posts))
  }

  useEffect(() => {
    handleGetPosts(menu, 1);
  }, [])

  return (
    <div className={styles.postFeed}>
      {
        (menu === 'all' || menu === 'blog' || menu === 'video') && <PostFeed format={menu}/>
      }
      {
        (menu === 'music' ) && <AlbumFeed format={menu}/>
      }
      <ScrollToTop/>
    </div>
  )
}

export default GridContainer