"use client"
import React, { useEffect, useState } from 'react'
import styles from './InteractiveComponent.module.css'
import Slider from 'react-slick';
import './SlickMenu.css'
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { updateCoverRes, updateCoverUrl } from '@/redux/post/draft.slice';
import PostThumbnail from '@/components/PostThumbnail/PostThumbnail';
import { FinalPost } from '@/types/Posts.type';
import { BlogPage } from '@/components/Blog/BlogPage';

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
  console.log(!draft.coverUrl && draft.coverThumbnail)
  return (
    <div className={`${styles.interContainer} ${styles.gridBlock}`}>
      {draft.toggle ?
        <Slider {...settings}>
          {
            (!draft.coverUrl && !draft.coverThumbnail) ? 
            <div className={styles.uploadImage}>
              <label htmlFor='coverInput' className={styles.icon}>
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path opacity="0.5" d="M21.9998 12.6978C21.9983 14.1674 21.9871 15.4165 21.9036 16.4414C21.8067 17.6308 21.6081 18.6246 21.1636 19.45C20.9676 19.814 20.7267 20.1401 20.4334 20.4334C19.601 21.2657 18.5405 21.6428 17.1966 21.8235C15.8835 22 14.2007 22 12.0534 22H11.9466C9.79929 22 8.11646 22 6.80345 21.8235C5.45951 21.6428 4.39902 21.2657 3.56664 20.4334C2.82871 19.6954 2.44763 18.777 2.24498 17.6376C2.04591 16.5184 2.00949 15.1259 2.00192 13.3967C2 12.9569 2 12.4917 2 12.0009V11.9466C1.99999 9.79929 1.99998 8.11646 2.17651 6.80345C2.3572 5.45951 2.73426 4.39902 3.56664 3.56664C4.39902 2.73426 5.45951 2.3572 6.80345 2.17651C7.97111 2.01952 9.47346 2.00215 11.302 2.00024C11.6873 1.99983 12 2.31236 12 2.69767C12 3.08299 11.6872 3.3952 11.3019 3.39561C9.44749 3.39757 8.06751 3.41446 6.98937 3.55941C5.80016 3.7193 5.08321 4.02339 4.5533 4.5533C4.02339 5.08321 3.7193 5.80016 3.55941 6.98937C3.39683 8.19866 3.39535 9.7877 3.39535 12C3.39535 12.2702 3.39535 12.5314 3.39567 12.7844L4.32696 11.9696C5.17465 11.2278 6.45225 11.2704 7.24872 12.0668L11.2392 16.0573C11.8785 16.6966 12.8848 16.7837 13.6245 16.2639L13.9019 16.0689C14.9663 15.3209 16.4064 15.4076 17.3734 16.2779L20.0064 18.6476C20.2714 18.091 20.4288 17.3597 20.5128 16.3281C20.592 15.3561 20.6029 14.1755 20.6044 12.6979C20.6048 12.3126 20.917 12 21.3023 12C21.6876 12 22.0002 12.3125 21.9998 12.6978Z" fill="#ffffff"></path> <path fillRule="evenodd" clipRule="evenodd" d="M17.5 11C15.3787 11 14.318 11 13.659 10.341C13 9.68198 13 8.62132 13 6.5C13 4.37868 13 3.31802 13.659 2.65901C14.318 2 15.3787 2 17.5 2C19.6213 2 20.682 2 21.341 2.65901C22 3.31802 22 4.37868 22 6.5C22 8.62132 22 9.68198 21.341 10.341C20.682 11 19.6213 11 17.5 11ZM19.5303 5.46967L18.0303 3.96967C17.7374 3.67678 17.2626 3.67678 16.9697 3.96967L15.4697 5.46967C15.1768 5.76256 15.1768 6.23744 15.4697 6.53033C15.7626 6.82322 16.2374 6.82322 16.5303 6.53033L16.75 6.31066V8.5C16.75 8.91421 17.0858 9.25 17.5 9.25C17.9142 9.25 18.25 8.91421 18.25 8.5V6.31066L18.4697 6.53033C18.7626 6.82322 19.2374 6.82322 19.5303 6.53033C19.8232 6.23744 19.8232 5.76256 19.5303 5.46967Z" fill="#ffffff"></path> </g></svg>
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
            <BlogPage post={draft} cover={draft.coverThumbnail || draft.coverUrl}/>
          </div>
        </Slider>
      :
        <div>Interract</div>
      }
    </div>
    
  )
}

export default InteractiveComponent