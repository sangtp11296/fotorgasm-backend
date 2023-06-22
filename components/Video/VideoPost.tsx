import React from 'react'
import styles from './VideoPost.module.css'
import { Video } from '@/types/Videos.type'
import Image from 'next/image'

interface Props {
  video: Video
}
const VideoPost: React.FC<Props> = ({ video }) => {

  function randomNum(){
    // Generate a random number between min and max
    const num = Math.floor(Math.random() * (100000000 - 0 + 1)) + 0;
    const thousands = Math.floor(num / 1000);
    const millions = Math.floor(num / 1000000);
    const remainder = Math.floor((num % 1000) / 100);
    // Check if the number is greater than 1000
    if (num >= 1000 && num < 10000) {
      // Add "k" as thousands to the number
      if (remainder === 0){
        return <span>{thousands}k</span>;
      } else return <span>{thousands}k{remainder}</span>;
    } else if (num === 0) {
      return null;
    } else if (num >= 10000 && num < 1000000){
        return <span>{thousands}k</span>
    } else if (num >= 1000000){
        return <span>{millions}M</span>
    } else {
      return <span>{num}</span>;
    } 
  }

  return (
    <div id={`${video.id}`} className={`${styles.videoPost}`}>
      <div className={styles.postCover}>
        <div className={styles.coverVideo}>
          <video className={styles.videoSrc} poster={video.image} muted>
            {video.video_files.map((video) => {
              return(
                <source src={`${video.link}`} type={`${video.file_type}`} key={video.id}/>
              )
            })}
          </video>
          <div className={styles.postOverlay}></div>
          <button className={styles.fullScreen}>
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                  <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
                  <g id="SVGRepo_iconCarrier"> 
                  <path d="M21 14V16.2C21 17.8802 21 18.7202 20.673 19.362C20.3854 19.9265 19.9265 20.3854 19.362 20.673C18.7202 21 17.8802 21 16.2 21H14M10 3H7.8C6.11984 3 5.27976 3 4.63803 3.32698C4.07354 3.6146 3.6146 4.07354 3.32698 4.63803C3 5.27976 3 6.11984 3 7.8V10M15 9L21 3M21 3H15M21 3V9M9 15L3 21M3 21H9M3 21L3 15" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  </path> 
                  </g>
              </svg>
          </button>
          <div className={styles.postInfo}>
            <div className={`${styles.postCat}`}>
                <Image alt={`on ${video.cat}`} src={`/assets/images/on ${video.cat}.png`} height={25} width={25}/>
                <span>on {video.cat}</span>
            </div>
            <div className={styles.titlePost}>
                <h2>{video.title}</h2>
            </div>
            <div className={styles.postDesc}>
                {video.desc}
            </div>
          </div>
          <div className={styles.postSocial}>
            <button className={styles.button}>
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M12.62 20.8101C12.28 20.9301 11.72 20.9301 11.38 20.8101C8.48 19.8201 2 15.6901 2 8.6901C2 5.6001 4.49 3.1001 7.56 3.1001C9.38 3.1001 10.99 3.9801 12 5.3401C13.01 3.9801 14.63 3.1001 16.44 3.1001C19.51 3.1001 22 5.6001 22 8.6901C22 15.6901 15.52 19.8201 12.62 20.8101Z" stroke="#fff" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"></path> </g></svg>
            </button>
            {randomNum()}
            <button className={styles.button}>
                <svg viewBox="0 0 24 24" id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" fill="#ffffff">
                <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
                <g id="SVGRepo_iconCarrier">
                <path className="cls-1" d="M21.5,12A9.5,9.5,0,1,0,12,21.5h9.5l-2.66-2.92A9.43,9.43,0,0,0,21.5,12Z" fill='none' stroke='#fff' strokeMiterlimit={10} strokeWidth='1.2px'></path></g></svg>
            </button>
            {randomNum()}
            <button className={styles.button}>
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M20.5 3.5L3.5 9L10 12L17 7L12 14L15 20.5L20.5 3.5Z" strokeWidth='1.2' stroke="#ffffff" strokeLinecap="round" strokeLinejoin="round"></path> </g></svg>
            </button>
            {randomNum()}
            <div className={styles.iconContainer}>
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke='var(--on-background-matte)'><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M21.0799 8.58003V15.42C21.0799 16.54 20.4799 17.58 19.5099 18.15L13.5699 21.58C12.5999 22.14 11.3999 22.14 10.4199 21.58L4.47992 18.15C3.50992 17.59 2.90991 16.55 2.90991 15.42V8.58003C2.90991 7.46003 3.50992 6.41999 4.47992 5.84999L10.4199 2.42C11.3899 1.86 12.5899 1.86 13.5699 2.42L19.5099 5.84999C20.4799 6.41999 21.0799 7.45003 21.0799 8.58003Z" stroke="inherrit" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path> <path d="M9.75 11.9999V10.7999C9.75 9.25989 10.84 8.62993 12.17 9.39993L13.21 9.9999L14.25 10.5999C15.58 11.3699 15.58 12.6299 14.25 13.3999L13.21 13.9999L12.17 14.5999C10.84 15.3699 9.75 14.7399 9.75 13.1999V11.9999Z" stroke="inherrit" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"></path> </g></svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default VideoPost