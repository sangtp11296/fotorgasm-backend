'use client'
import React, { useCallback, useEffect, useState } from 'react'
import styles from './PostFeed.module.css'
import BlogPost from '../Blog/BlogPost'
import InfiniteScroll from 'react-infinite-scroll-component'
import { getPosts } from '@/utils/getPosts'
import Link from 'next/link'
import { FetchedPost } from '@/types/Posts.type'

const PostFeed: React.FC = () => {

  const [posts, setPosts] = useState<FetchedPost[]>([]);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [page, setPage] = useState<number>(2)

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
  const handleClick = useCallback((e: React.MouseEvent, id: string) => {
    e.preventDefault();
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
  console.log(posts)
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
            posts.map((post) => {
              if (post.format === 'blog'){
                // const photo = post as Photo; // Type assertion
                return(
                  <Link key={post._id} onClick={(e) => handleClick(e, post._id)} href='/posts/abc' className={`${styles.postWrapper} ${post.coverRes.width < post.coverRes.height ? styles.portrait : (post.coverRes.width > post.coverRes.height ? styles.landscape : styles.square)}`}>
                    <BlogPost data={post}/>
                  </Link>
                )
              } else {
                // const video = post as Video; // Type assertion
                // return (
                //   <Link key={post._id} onClick={(e) => handleClick(e, `${post._id}`)} href={``} className={`${styles.postWrapper} ${post.coverRes.width < post.coverRes.height ? styles.portrait : (post.coverRes.width > post.coverRes.height ? styles.landscape : styles.square)}`}>
                //     {/* <VideoPost video={post}/> */}
                //   </Link>
                // )
              }
            })
          }
        </div>
      </InfiniteScroll>
    </div>
  )
}

export default PostFeed