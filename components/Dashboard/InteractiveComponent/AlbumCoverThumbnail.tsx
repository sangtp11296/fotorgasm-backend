'use client'
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import React, { useEffect } from 'react'
import styles from './InteractiveComponent.module.css'
import { albumCoverUrl } from '@/redux/post/album.slice';
import { AlbumThumbnail } from '@/components/AlbumThumbnail/AlbumThumbnail';

type Props = {
    cover: File | undefined
}
export const AlbumCoverThumbnail: React.FC<Props> = ({ cover }) => {
    const dispatch = useAppDispatch();
    const album = useAppSelector((state) => state.draftAlbum);
    // Get presigned Url to upload cover and get the thumbnail URL
    const handleUploadThumbnail = async () => {
        const reqPresignedURL = await fetch('https://4esg1vvhi3.execute-api.ap-southeast-1.amazonaws.com/dev/upload-thumbnail-image', {
        method: 'POST',
        body: JSON.stringify({
            fileName: album.slug + `-cover.${cover?.type.split('/')[1]}`,
            fileType: cover?.type,
        }),
        });
        const reqData = await reqPresignedURL.json();
        const { presignedUrl } = JSON.parse(reqData.body);

        const upload = await fetch(presignedUrl, {
            method: 'PUT',
            headers: {
                'Content-Type': cover!.type,
            },
            body: cover,
        })
        const moveDraft = await fetch('https://4esg1vvhi3.execute-api.ap-southeast-1.amazonaws.com/dev/move-draft', {
            method: "POST",
            headers: {
              'Content-Type': 'application/json' // Set the Content-Type header
            },
            body: JSON.stringify({
              slug: album.slug,
              format: 'album'
            }),
        });
        moveDraft.status === 200 && window.location.reload();
    }
    
    useEffect(() => {
        if (album.submit) {
            handleUploadThumbnail();
        }
    }, [album.submit])
  return (
    <div className={styles.coverGrid} >
        <div className={styles.iconContainer} onClick={() => dispatch(albumCoverUrl(''))}>
        <svg height='15px' viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" strokeWidth="7" stroke="#fff" fill="none"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"><line x1="8.06" y1="8.06" x2="55.41" y2="55.94"></line><line x1="55.94" y1="8.06" x2="8.59" y2="55.94"></line></g></svg>
        </div>
        <div className={`${styles.coverWraper} ${styles.square}`}>
            <AlbumThumbnail data={album}/>
        </div>
    </div>
  )
}
