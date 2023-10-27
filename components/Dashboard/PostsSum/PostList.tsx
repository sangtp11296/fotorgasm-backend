'use client'
import { FetchedPost } from '@/types/Posts.type'
import styles from './PostSum.module.css'
import React, { useEffect, useState } from 'react'
import { getPosts } from '@/utils/getPosts';
import { convertDatePost } from '@/utils/common/convertDatePost';
import { AuthorIcon, BlogIcon, CommentIcon, HeartIcon, HomeIcon, MusicIcon, PhotoIcon, PostTypeIcon, PublishStatusIcon, UploadDateIcon, VideoIcon } from '@/components/ButtonIcon/StaticIcons'

const icons: { [key: string]: React.JSX.Element } = {
  'home': (
    <HomeIcon color='var(--on-background-matte)'/>
  ),
  'blog': (
    <BlogIcon color='var(--on-background-matte)'/>
  ),
  'video': (
    <VideoIcon color='var(--on-background-matte)'/>
  ),
  'photo': (
    <PhotoIcon color='var(--on-background-matte)'/>
  ),
  'music': (
    <MusicIcon color='var(--on-background-matte)'/>
  )
}

interface Props {
    total: (totalPosts: number) => void,
    chosen: (chosenPost: FetchedPost) => void,
    format: string
}
export const PostList: React.FC<Props> = ({ total, chosen, format }) => {

     // Handle get posts
    const [posts, setPosts] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPosts, setTotalPosts] = useState();
    const handleGetPosts = async (page: number) => {
        const data = getPosts(format, page, 5);
        setTotalPosts((await data).totalPosts)
        total((await data).totalPosts);
        setPosts((await data).posts);
    }
    useEffect(() => {
        handleGetPosts(page);
    }, [page, format])
     // Handle active edit
    const [chosenPost, setChosenPost] = useState<FetchedPost>()
    // Handle active pagination
    const [activeBtn, setActiveBtn] = useState<number>(1)
    const handleActive = (page: number) => {
        setPage(page);
        setActiveBtn(page)
    }
  return (
    <>
        <table id='postList' className={styles.postList}>
            <thead>
                <tr className={styles.listLabel}>
                {/* Title */}
                  <th className={styles.labelItem}>Title</th>
                  {/* Author */}
                  <th className={`${styles.labelItem} ${styles.iconContainer}`}>
                      <AuthorIcon color="var(--on-background-matte)"/>
                  </th>
                  {/* Post Type */}
                  <th className={`${styles.labelItem} ${styles.iconContainer}`}>
                      <PostTypeIcon color="var(--on-background-matte)"/>
                  </th>
                  {/* Created Date */}
                  <th className={`${styles.labelItem} ${styles.iconContainer}`}>
                      <UploadDateIcon color="var(--on-background-matte)"/>
                  </th>
                  {/* Status */}
                  <th className={`${styles.labelItem} ${styles.iconContainer}`}>
                      <PublishStatusIcon color="var(--on-background-matte)"/>
                  </th>
                  {/* Like */}
                  <th className={`${styles.labelItem} ${styles.iconContainer}`}>
                      <HeartIcon color="var(--on-background-matte)"/>
                  </th>
                  {/* Comment */}
                  <th className={`${styles.labelItem} ${styles.iconContainer}`}>
                      <CommentIcon color="var(--on-background-matte)"/>
                  </th>
                </tr>
            </thead>
            <tbody>
                {
                posts.map((post: FetchedPost, ind) => {
                    return(
                    <tr style={{backgroundColor: chosenPost?._id === post._id ? 'var(--surface-16)': ''}} onClick={() => {
                        setChosenPost(post)
                        chosen(post)
                        }} key={ind}>
                        <td>{post.title}</td>
                        <td>{post.author}</td>
                        <td>{icons[post.format]}</td>
                        <td>{convertDatePost(post.createdAt)}</td>
                        <td>{post.views}</td>
                        <td>{post.likes}</td>
                        <td>{post.comments.length}</td>
                    </tr>
                    )
                })
                }

            </tbody>
        </table>
        <div className={styles.pagination}>
            {
              totalPosts &&
              Array(Math.ceil(totalPosts / 5)).fill(null).map((_, i) => (
                <button style={{backgroundColor: (activeBtn === i + 1) ? 'var(--on-background)' : 'var(--on-background-matte)'}} key={i} onClick={() => handleActive(i + 1)}></button>
              ))
            }
          </div>
    </>
  )
}
