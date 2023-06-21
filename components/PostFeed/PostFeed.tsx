'use client'
import React, { useEffect, useState } from 'react'
import styles from './PostFeed.module.css'
import { getPhotos } from '@/utils/getPhotos'
import { Photo } from '@/types/Photos.type'
import Post from '../Blog/BlogPost'
import InfiniteScroll from 'react-infinite-scroll-component'
import { Video } from '@/types/Videos.type'
import VideoPost from '../Video/VideoPost'

interface Props {
  data: (Photo | Video)[]
}

const PostFeed: React.FC<Props> = ({ data }) => {

  const [posts, setPosts] = useState<(Photo | Video)[]>([]);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [page, setPage] = useState<number>(2)
  
  useEffect(() => {
    setPosts(data);
  }, [])

  // Get more photos
  const getMorePhotos = async () => {
    // try{
    //   const res: Promise<Photo[]> = getPhotos(page, 10);
    //   const data: Photo[] = await res;
    //   if (data.length > 0){
    //     setPhotos((prevPhotos) => [...prevPhotos,...data]);
    //     setPage((prevPage) => prevPage + 1)
    //   } else {
    //     setHasMore(false);
    //   }
    // } catch (err) {
    //   console.error('Error fetching photos:', err);
    // }
  }

  
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
              if (post.type === 'photo'){
                return(
                  <Post key={post.id} photo={post}/>
                )
              } else {
                return (
                  <VideoPost key={post.id} video={post}/>
                )
              }
            })
          }
        </div>
      </InfiniteScroll>
    </div>
  )
}

export default PostFeed