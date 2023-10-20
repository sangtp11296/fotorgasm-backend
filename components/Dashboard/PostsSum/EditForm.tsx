'use client'
import React, { useState } from 'react'
import styles from './PostSum.module.css'
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { FinalPost } from '@/types/Posts.type';
import { submitDraft } from '@/redux/post/draft.slice';
import { FinalAlbum } from '@/types/Album.type';
import { submitAlbum } from '@/redux/post/album.slice';
import { PostForm } from './PostForm';
import { AlbumForm } from './AlbumForm';


export const EditForm = () => {
    const [error, setError] = useState();
    const draft = useAppSelector((state) => state.draft);
    const draftAlbum = useAppSelector((state) => state.draftAlbum);
    const dispatch = useAppDispatch();
    // Submit Post
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) =>{
    e.preventDefault();
    if(draft.status === 'published'){
      // Update published post
      const formUpdate = {
        id: draft._id,
        author: draft.author,
        category: draft.category,
        content: draft.content,
        desc: draft.desc,
        format: draft.format,
        title: draft.title,
        slug: draft.slug,
        tags: draft.tags,
      }
      const res = await fetch(`https://4esg1vvhi3.execute-api.ap-southeast-1.amazonaws.com/dev/post/${draft._id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json' // Set the Content-Type header
            },
            body: JSON.stringify(formUpdate)
          });
          res.status === 200 && window.location.reload();
    } else {
      // Create new Post
      if (draft.author && draft.format && draft.title && draft.category && draft.tags && draft.desc && draft.coverUrl) {
        
        if (draft.format === 'blog'){
          // Update cover photo first to get the thumbnail url and cover key
          const formData: FinalPost = {
            author: draft.author,
            category: draft.category,
            content: draft.content,
            coverKey: '',
            coverThumbnail: '',
            coverRes: draft.coverRes,
            desc: draft.desc,
            format: draft.format,
            title: draft.title,
            slug: draft.slug,
            tags: draft.tags,
            status: 'published'
          }
          const res = await fetch('https://4esg1vvhi3.execute-api.ap-southeast-1.amazonaws.com/dev/post', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json' // Set the Content-Type header
            },
            body: JSON.stringify(formData)
          });
          // Move all draft images to posts folder in s3 bucket
          if(res.status === 200){
            dispatch(submitDraft(false));
            dispatch(submitDraft(true));
            if(draft.content.includes('<img')){
              const moveDraft = await fetch('https://4esg1vvhi3.execute-api.ap-southeast-1.amazonaws.com/dev/move-draft', {
                method: "POST",
                headers: {
                  'Content-Type': 'application/json' // Set the Content-Type header
                },
                body: JSON.stringify({
                  slug: draft.slug,
                  format: 'image'
                }),
              });
              moveDraft.status === 200 && window.location.reload();
            }
          }
        } else if (draft.format === 'video') {
          // Update cover photo first to get the thumbnail url and cover key
          const formData: FinalPost = {
            author: draft.author,
            category: draft.category,
            coverKey: '',
            coverThumbnail: '',
            coverRes: draft.coverRes,
            desc: draft.desc,
            format: draft.format,
            title: draft.title,
            slug: draft.slug,
            tags: draft.tags,
            videoSrc: {
              high: ``,
              medium: '',
              low: '',
            },
            status: 'published'
          }
  
          const res = await fetch('https://4esg1vvhi3.execute-api.ap-southeast-1.amazonaws.com/dev/post', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json' // Set the Content-Type header
            },
            body: JSON.stringify(formData)
          });
  
          // Move all draft videos to posts folder in s3 bucket
          if (res.status === 200){
            dispatch(submitDraft(false));
            dispatch(submitDraft(true));
            const moveDraft = await fetch('https://4esg1vvhi3.execute-api.ap-southeast-1.amazonaws.com/dev/move-draft', {
              method: "POST",
              headers: {
                'Content-Type': 'application/json' // Set the Content-Type header
              },
              body: JSON.stringify({
                slug: draft.slug,
                format: 'video'
              }),
            });
            moveDraft.status === 200 && window.location.reload();
          }
  
        }
      }
      // Create new Album
      if (draftAlbum.format && draftAlbum.artists && draftAlbum.composers && draftAlbum.coverUrl && draftAlbum.genres && draftAlbum.tags && draftAlbum.title && draftAlbum.year){
        
        // Update cover photo first to get the thumbnail url and cover key
        const formData: FinalAlbum = {
          artists: draftAlbum.artists,
          composers: draftAlbum.composers,
          genres: draftAlbum.genres,
          coverRes: draftAlbum.coverRes,
          format: draftAlbum.format,
          title: draftAlbum.title,
          slug: draftAlbum.slug,
          tags: draftAlbum.tags,
          distinctions: draftAlbum.distinctions,
          desc: draftAlbum.desc,
          year: draftAlbum.year,
          status: 'published'
        }
        const res = await fetch('https://4esg1vvhi3.execute-api.ap-southeast-1.amazonaws.com/dev/music', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json' // Set the Content-Type header
          },
          body: JSON.stringify(formData)
        });

        // Move all draft songs to albums folder in s3 bucket
        if(res.status === 200){
          dispatch(submitAlbum(false));
          dispatch(submitAlbum(true));
        }
      }
    }
  }
  return (
    <div className={styles.editField}>
        <form className={styles.textForm} onSubmit={(e) => handleSubmit(e)}>
            {
            (draft.format === 'blog' || draft.format === 'video') &&
            <PostForm/>
            }
            {
            (draftAlbum.format === 'album') &&
            <AlbumForm/>
            }
            <div className={styles.submit}>
            {
                draft.status === 'published' ?
                <button style={{backgroundColor: 'var(--surface-06)'}} className={styles.button} type='submit'>Update</button>
                :
                <button className={styles.button} type='submit'>Submit</button>
            }
            </div>
            {error ? <div><h5 style={{color:'red',textAlign:'right'}}>Something went wrong! Please check again...</h5></div>:null}
        </form>
    </div> 
  )
}
