"use client"
import React, { useEffect, useState } from 'react'
import styles from './InteractiveComponent.module.css'
import BlogPost from '@/components/Blog/BlogPost';
import { PreviewPost } from '@/types/Posts.type';
import Slider from 'react-slick';
import './SlickMenu.css'


interface PostInfo {
  format: string,
  title: string,
  slug: string,
  author: string,
  category: string,
  description: string,
  tags: string[],
}
// Define props
interface Props {
  editorMode: boolean,
  postInfo: PostInfo | null
}
const InteractiveComponent: React.FC<Props> = ({ editorMode, postInfo }) => {
  const [finalPost, setFinalPost] = useState<PreviewPost>({})
  const [cover, setCover] = useState<File | null>(null);
  const [coverURL,setCoverURL] = useState<string>('');
  const [coverRes, setCoverRes] = useState<{
                                              width: number;
                                              height: number;
                                          }>({width:0, height:0});
  
  // Update Final Post
  useEffect(() => {
    setFinalPost((prev) => ({ ...prev, ...postInfo }))
  }, [postInfo, cover, coverRes])
  useEffect(() => {
    if(cover){
      setFinalPost((prev) => ({...prev, coverRes: coverRes, cover: URL.createObjectURL(cover)}))
    }
  }, [cover])

  // Upload Cover Image and Consider Resolution
  const handleCoverImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    setCover(file)
    if(file) {
      const image = new Image();
      image.onload = () => {
          setCoverRes({
            width: image.naturalWidth,
            height: image.naturalHeight
          })
      };
      image.src = URL.createObjectURL(file);
    }
  }
  console.log(finalPost, 'finalPost')

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
      {editorMode ?
        <Slider {...settings}>
          {
            !cover ? 
            <div className={styles.uploadImage}>
              <label htmlFor='fileInput' className={styles.icon}>
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M13 4H8.8C7.11984 4 6.27976 4 5.63803 4.32698C5.07354 4.6146 4.6146 5.07354 4.32698 5.63803C4 6.27976 4 7.11984 4 8.8V15.2C4 16.8802 4 17.7202 4.32698 18.362C4.6146 18.9265 5.07354 19.3854 5.63803 19.673C6.27976 20 7.11984 20 8.8 20H15.2C16.8802 20 17.7202 20 18.362 19.673C18.9265 19.3854 19.3854 18.9265 19.673 18.362C20 17.7202 20 16.8802 20 15.2V11" stroke="var(--on-background)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path> <path d="M4 16L8.29289 11.7071C8.68342 11.3166 9.31658 11.3166 9.70711 11.7071L13 15M13 15L15.7929 12.2071C16.1834 11.8166 16.8166 11.8166 17.2071 12.2071L20 15M13 15L15.25 17.25" stroke="var(--on-background)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path> <path d="M18.5 3V5.5M18.5 8V5.5M18.5 5.5H16M18.5 5.5H21" stroke="var(--on-background)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path> </g></svg>
              </label>
              <label htmlFor='fileInput' className={styles.uploadBtn}>Upload Image</label>
              <input type='file' id='fileInput' required style={{display:'none'}} onChange={handleCoverImageUpload}/>
            </div> 
            :
            <div className={styles.coverGrid} >
              <div className={styles.iconContainer} onClick={() => setCover(null)}>
                <svg height='15px' viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" strokeWidth="7" stroke="#fff" fill="none"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"><line x1="8.06" y1="8.06" x2="55.41" y2="55.94"></line><line x1="55.94" y1="8.06" x2="8.59" y2="55.94"></line></g></svg>
              </div>
              <div className={`${styles.coverWraper} ${coverRes.width < coverRes.height ? styles.portrait : (coverRes.width > coverRes.height ? styles.landscape : styles.square)}`}>
                <BlogPost photo={finalPost}/>
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