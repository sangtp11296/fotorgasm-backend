"use client"
import React, { useEffect, useState } from 'react'
import styles from './InteractiveComponent.module.css'
import BlogPost from '@/components/Blog/BlogPost';
import Slider from 'react-slick';
import './SlickMenu.css'
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { updateCoverKey, updateCoverRes, updateCoverThumbnail, updateCoverUrl } from '@/redux/post/draft.slice';
import PostThumbnail from '@/components/PostThumbnail/PostThumbnail';

const InteractiveComponent: React.FC = () => {
  const [cover, setCover] = useState<File>();
  const draft = useAppSelector((state) => state.draft);
  const dispatch = useAppDispatch();

  // Upload Cover Image and Consider Resolution
  const handleCoverImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    const imageUrl = file ? URL.createObjectURL(file) : '';
    dispatch(updateCoverUrl(imageUrl));
    setCover(file);
    if(file) {
      const image = new Image();
      image.onload = () => {
        dispatch(updateCoverRes({
          width: image.naturalWidth,
          height: image.naturalHeight
        }))
      };
      image.src = URL.createObjectURL(file);
    }
  }

  // Get presigned Url to upload cover and get the thumbnail URL
  const handleUploadThumbnail = async () => {
    const reqPresignedURL = await fetch('https://vjbjtwm3k8.execute-api.ap-southeast-1.amazonaws.com/dev/upload-thumbnail-image', {
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

  // Pagination setting
  const settings = {
    dots: true,
    isfinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    swipeToSlide: true,
    dotsClass: 'slick-dots custom-dots',
    customPaging: (i: any) => <button></button>,
  }
  return (
    <div className={`${styles.interContainer} ${styles.gridBlock}`}>
      {draft.toggle ?
        <Slider {...settings}>
          {
            !draft.coverUrl ? 
            <div className={styles.uploadImage}>
              <label htmlFor='coverInput' className={styles.icon}>
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M13 4H8.8C7.11984 4 6.27976 4 5.63803 4.32698C5.07354 4.6146 4.6146 5.07354 4.32698 5.63803C4 6.27976 4 7.11984 4 8.8V15.2C4 16.8802 4 17.7202 4.32698 18.362C4.6146 18.9265 5.07354 19.3854 5.63803 19.673C6.27976 20 7.11984 20 8.8 20H15.2C16.8802 20 17.7202 20 18.362 19.673C18.9265 19.3854 19.3854 18.9265 19.673 18.362C20 17.7202 20 16.8802 20 15.2V11" stroke="var(--on-background)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path> <path d="M4 16L8.29289 11.7071C8.68342 11.3166 9.31658 11.3166 9.70711 11.7071L13 15M13 15L15.7929 12.2071C16.1834 11.8166 16.8166 11.8166 17.2071 12.2071L20 15M13 15L15.25 17.25" stroke="var(--on-background)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path> <path d="M18.5 3V5.5M18.5 8V5.5M18.5 5.5H16M18.5 5.5H21" stroke="var(--on-background)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path> </g></svg>
              </label>
              <label htmlFor='coverInput' className={styles.uploadBtn}>Upload Image</label>
              <input type='file' id='coverInput' required style={{display:'none'}} onChange={handleCoverImageUpload}/>
            </div> 
            :
            <div className={styles.coverGrid} >
              <div className={styles.iconContainer} onClick={() => dispatch(updateCoverUrl(''))}>
                <svg height='15px' viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" strokeWidth="7" stroke="#fff" fill="none"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"><line x1="8.06" y1="8.06" x2="55.41" y2="55.94"></line><line x1="55.94" y1="8.06" x2="8.59" y2="55.94"></line></g></svg>
              </div>
              <div className={`${styles.coverWraper} ${draft.coverRes.width < draft.coverRes.height ? styles.portrait : (draft.coverRes.width > draft.coverRes.height) ? styles.landscape : styles.square}`}>
                <PostThumbnail data={draft}/>
              </div>
            </div>
          }
          <div>
            BlogPage
          </div>
        </Slider>
      :
        <div>Interract</div>
      }
    </div>
    
  )
}

export default InteractiveComponent