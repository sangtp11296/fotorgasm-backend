'use client'
import React, { useCallback, useEffect, useState } from 'react'
import styles from './PostFeed.module.css'
import InfiniteScroll from 'react-infinite-scroll-component'
import { getPosts } from '@/utils/getPosts'
import Link from 'next/link'
import { FetchedPost } from '@/types/Posts.type'
import PostThumbnail from '../PostThumbnail/PostThumbnail'
import { useAppSelector } from '@/redux/hooks'
import ScrollToTop from '../Button/ScrollToTop'

const PostFeed: React.FC = () => {

  const [posts, setPosts] = useState<FetchedPost[]>([]);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [page, setPage] = useState<number>(2)

  const menu = useAppSelector(state => state.click.mainMenu);

  // Get first time loading posts
  const handleGetPosts = async (page: number) => {
    const res = getPosts(page, 5);
    setPosts((await res).posts);
  }

  useEffect(() => {
    handleGetPosts(1);
  }, [])

  // Get more posts
  const getMorePhotos = async () => {
    try{
      const res = getPosts(page, 5);
      const posts = (await res).posts;
      if (posts.length > 0){
        setPosts((prevPhotos) => [...prevPhotos, ...posts]);
        setPage((prevPage) => prevPage + 1)
      } else {
        setHasMore(false);
      }
    } catch (err) {
      console.error('Error fetching photos:', err);
    }
  }

  // Focus to chosen post
  const handleClick = useCallback((id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const { top, height } = element.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const scrollPosition = top + window.scrollY - (windowHeight / 2) + (height / 2);
      window.scrollTo({
        top: scrollPosition,
        behavior: 'smooth',
      });
    }
  }, []);
  return (
    <div className={styles.postFeed}>
      <InfiniteScroll 
        dataLength={posts.length}
        next={getMorePhotos}
        hasMore={hasMore}
        loader={<h4>Loading...</h4>}
        endMessage={<h4>Nothing more to show</h4>}
        style={{ overflow: 'hidden' }}
        scrollThreshold={0.9}
      >
        <div className={styles.masonryContainer}>
          {
            menu === 'all' ?
            posts.map((post) => {
              return(
                <Link key={post._id} onClick={(e) => handleClick(post._id)} href={`/posts/${post.slug}`} className={`${styles.postWrapper} ${post.coverRes.width < post.coverRes.height ? styles.portrait : (post.coverRes.width > post.coverRes.height ? styles.landscape : styles.square)}`}>
                  <PostThumbnail data={post}/>
                </Link>
              )
            }) :
            posts.map((post) => {
              if (post.format === menu){
                return(
                  <Link key={post._id} onClick={(e) => handleClick(post._id)} href={`/posts/${post.slug}`} className={`${styles.postWrapper} ${post.coverRes.width < post.coverRes.height ? styles.portrait : (post.coverRes.width > post.coverRes.height ? styles.landscape : styles.square)}`}>
                    <PostThumbnail data={post}/>
                  </Link>
                )
              }
            })
          }
        </div>
      </InfiniteScroll>
      <ScrollToTop/>
    </div>
  )
}

export default PostFeed