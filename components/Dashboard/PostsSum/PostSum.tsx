'use client'
import React, { useState } from 'react'
import styles from './PostSum.module.css'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { clearDraft, updateAuthor, updateCat, updateContent, updateCoverKey, updateCoverRes, updateCoverThumbnail, updateDesc, updateFormat, updateId, updateSlug, updateStatus, updateTag, updateTitle } from '@/redux/post/draft.slice'
import { FetchedPost } from '@/types/Posts.type'
import { toggleEditor } from '@/redux/clickMenu/click.slice'
import { EditForm } from './EditForm'
import { albumArtists, albumComposers, albumCoverKey, albumCoverRes, albumCoverThumbnail, albumDesc, albumDistinctions, albumDominantColor, albumFormat, albumGenres, albumId, albumSlug, albumSongs, albumStatus, albumTags, albumTitle, albumYear, clearAlbum } from '@/redux/post/album.slice'
import { PostList } from './PostList'
import { AlbumList } from './AlbumList'
import { FetchAlbum } from '@/types/Album.type'
import { AddPostIcon, BlogIcon, CancelAddPostIcon, EditPostIcon, HomeIcon, MusicIcon, PhotoIcon, VideoIcon } from '@/components/ButtonIcon/StaticIcons'

// Define props
interface Props {
  menuType: string,
}

// Define Post Meta Data type

const icons: { [key: string]: React.JSX.Element } = {
  'home': (
    <HomeIcon color='var(--primary)'/>
  ),
  'blog': (
    <BlogIcon color='var(--primary)'/>
  ),
  'video': (
    <VideoIcon color='var(--primary)'/>
  ),
  'photo': (
    <PhotoIcon color='var(--primary)'/>
  ),
  'music': (
    <MusicIcon color='var(--primary)'/>
  )
}

const PostSum: React.FC<Props> = ({ menuType }) => {
  const editorMode = useAppSelector((state) => state.click.editorMode);
  const dispatch = useAppDispatch();

  const handleTrigger = async () => {
    if (!editorMode) {
      dispatch(toggleEditor(true))
      if (menuType === 'blog' || menuType === 'video'){
        dispatch(updateFormat(menuType));
      } else if (menuType === 'music') {
        dispatch(albumFormat('album'));
      }
    } else {
      dispatch(toggleEditor(false))
      dispatch(clearDraft());
      dispatch(clearAlbum());

      // Fetch api to delete everthing in draft folder
      const reqDeleteDraft = await fetch('https://4esg1vvhi3.execute-api.ap-southeast-1.amazonaws.com/dev/delete-draft',{
        method: 'DELETE'
      })
      if (reqDeleteDraft.ok) {
        const data = await reqDeleteDraft.json();
        console.log(data.message); // Success message from Lambda API
      } else {
        console.error('API request failed:', reqDeleteDraft.statusText);
      }
    }
  }

  // Handle total posts
  const [totalPosts, setTotalPosts] = useState<number>()
  const handleTotalPosts = (newTotal: number) => {
    setTotalPosts(newTotal);
  };
  
  // Handle active edit
  const [chosenPost, setChosenPost] = useState<FetchedPost>()
  const [chosenAlbum, setChosenAlbum] = useState<FetchAlbum>()

  const handleChosenPost = (post: FetchedPost) => {
    setChosenPost(post);
  }
  const handleChosenAlbum = (album: FetchAlbum) => {
    setChosenAlbum(album)
  }
  const handleEditTrigger = (post: FetchedPost | undefined, album: FetchAlbum | undefined) => {
    if (post){
      if (!editorMode) {
        dispatch(toggleEditor(true));
        dispatch(updateId(post._id));
        dispatch(updateFormat(post.format));
        dispatch(updateTitle(post.title));
        dispatch(updateSlug(post.slug));
        dispatch(updateAuthor(post.author));
        dispatch(updateCat(post.category));
        dispatch(updateTag(post.tags));
        dispatch(updateDesc(post.desc));
        post.content && dispatch(updateContent(post.content));
        dispatch(updateCoverKey(post.coverKey));
        dispatch(updateCoverThumbnail(post.coverThumbnail));
        dispatch(updateCoverRes(post.coverRes));
        dispatch(updateStatus(post.status));
      }
      else {
        dispatch(clearDraft());
        dispatch(toggleEditor(false));
      }
    } else if (album){
      if (!editorMode) {
        dispatch(toggleEditor(true));
        dispatch(albumId(album._id));
        dispatch(albumTitle(album.title));
        dispatch(albumFormat(album.format));
        dispatch(albumSlug(album.slug));
        dispatch(albumComposers(album.composers));
        dispatch(albumSongs(album.songs));
        dispatch(albumGenres(album.genres));
        dispatch(albumArtists(album.artists));
        dispatch(albumTags(album.tags));
        dispatch(albumDistinctions(album.distinctions));
        dispatch(albumDesc(album.desc));
        dispatch(albumYear(album.year));
        dispatch(albumCoverKey(album.coverKey));
        dispatch(albumCoverRes(album.coverRes));
        dispatch(albumDominantColor(album.dominantColor));
        dispatch(albumCoverThumbnail(album.coverThumbnail));
        dispatch(albumStatus(album.status));
      }
      else {
        dispatch(clearAlbum());
        dispatch(toggleEditor(false));
      }
    }
  }
  return (
    <div className={`${styles.postSumContainer} ${styles.gridBlock}`}>
      <div className={styles.sumHeader}>
        <div className={styles.leftHeader}>
          <h2>{menuType}</h2>
          {
            menuType === 'home' ? '' :
            <div className={styles.button} onClick={handleTrigger}>
              {
                !editorMode ? 
                  <AddPostIcon color="var(--on-background)"/>
                :
                  <CancelAddPostIcon color='var(--on-background)'/>
              }
            </div>
          }
          {
            (chosenPost || chosenAlbum) && 
            <button onClick={() => {
              chosenPost && handleEditTrigger(chosenPost, chosenAlbum);
              chosenAlbum && handleEditTrigger(chosenPost, chosenAlbum);
              }} style={{width:25, height:25, backgroundColor: 'transparent', marginLeft:'10px', cursor: "pointer"}} className={styles.button}>
              <EditPostIcon color='var(--on-background)'/>
            </button>
          }
        </div>
        <div className={styles.listCount}>
            <div className={styles.iconContainer}>
                {
                  icons.hasOwnProperty(menuType) && icons[menuType]
                }
            </div>
            <span>{totalPosts}</span>
        </div>
      </div>
      {
        editorMode ? 
        <EditForm/>
        : 
        // Post list 
        (menuType === 'blog' || menuType === 'video') ? <PostList format={menuType} total={handleTotalPosts} chosen={handleChosenPost}/> :
        <AlbumList total={handleTotalPosts} chosen={handleChosenAlbum}/>
      }
    </div>
  )
}

export default PostSum