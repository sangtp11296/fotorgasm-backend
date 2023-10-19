'use client'
import React, { useEffect } from 'react'
import styles from './InteractiveComponent.module.css'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { updateCoverUrl } from '@/redux/post/draft.slice';
import PostThumbnail from '@/components/PostThumbnail/PostThumbnail';

type Props = {
    cover: File | undefined
}
export const PostCoverThumbnail: React.FC<Props> = ({ cover }) => {
    const dispatch = useAppDispatch();
    const draft = useAppSelector((state) => state.draft);
    // Get presigned Url to upload cover and get the thumbnail URL
  const handleUploadThumbnail = async () => {
    const reqPresignedURL = await fetch('https://dit6xpvzr3.execute-api.ap-southeast-1.amazonaws.com/dev/upload-thumbnail-image', {
      method: 'POST',
      body: JSON.stringify({
        fileName: draft.slug + `-cover.${cover?.type.split('/')[1]}`,
        fileType: cover?.type,
      }),
    });
    const reqData = await reqPresignedURL.json();
    const { presignedUrl } = JSON.parse(reqData.body);

    const uploadThumbnail = await fetch(presignedUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': cover!.type,
      },
      body: cover,
    })
  }
  
  useEffect(() => {
    if (draft.submit) {
      handleUploadThumbnail();
    }
  }, [draft.submit])
  return (
    <div className={styles.coverGrid} >
        <div className={styles.iconContainer} onClick={() => dispatch(updateCoverUrl(''))}>
        <svg height='15px' viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" strokeWidth="7" stroke="#fff" fill="none"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"><line x1="8.06" y1="8.06" x2="55.41" y2="55.94"></line><line x1="55.94" y1="8.06" x2="8.59" y2="55.94"></line></g></svg>
        </div>
        <div className={`${styles.coverWraper} ${draft.coverRes.width < draft.coverRes.height ? styles.portrait : (draft.coverRes.width > draft.coverRes.height) ? styles.landscape : styles.square}`}>
            <PostThumbnail data={draft}/>
        </div>
    </div>
  )
}
