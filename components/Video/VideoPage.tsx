import { FetchedPost } from '@/types/Posts.type'
import React from 'react'
import { BackButton } from '../Button/BackButton';
import styles from './VideoPage.module.css'
import Image from 'next/image';

type Props = {
    post: FetchedPost,
    videoUrl: string[],
    coverUrl: string
}
export const VideoPage: React.FC<Props> = ({post, videoUrl, coverUrl} ) => {
  return (
    <>
    <BackButton/>
    {
        post.coverRes.height > post.coverRes.width && 
        <div className={styles.portraitPost}>
            <div className={styles.postCover}>
                <video className={styles.videoSrc} poster={coverUrl} muted autoPlay loop>
                    {videoUrl.map((vid,ind) => {
                        return(
                        <source src={vid}  key={ind} type={`video/${post.videoSrc?.high.split('.').pop()}`}/>
                        )
                    })}
                    Your browser does not support the video tag.
                </video>
            </div>
            <div className={`${styles.postOverlay}`}/>
            <div className={styles.postInfo}>
                <div className={`${styles.postCat}`}>
                    <Image alt={`on ${post.category}`} src={`/assets/images/on ${post.category}.png`} height={25} width={25}/>
                    <span>on {post.category}</span>
                </div>
                <div className={styles.titlePost}>
                    <h2>{post.title}</h2>
                </div>
                <div className={styles.postDesc}>
                    {post.desc}
                </div>
            </div>
            <div className={styles.postSocial}>
                <button className={styles.button}>
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M12.62 20.8101C12.28 20.9301 11.72 20.9301 11.38 20.8101C8.48 19.8201 2 15.6901 2 8.6901C2 5.6001 4.49 3.1001 7.56 3.1001C9.38 3.1001 10.99 3.9801 12 5.3401C13.01 3.9801 14.63 3.1001 16.44 3.1001C19.51 3.1001 22 5.6001 22 8.6901C22 15.6901 15.52 19.8201 12.62 20.8101Z" stroke="#fff" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"></path> </g></svg>
                </button>
                {post.likes}
                <button className={styles.button}>
                    <svg viewBox="0 0 24 24" id="Layer_1" post-name="Layer 1" xmlns="http://www.w3.org/2000/svg" fill="#ffffff">
                    <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                    <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
                    <g id="SVGRepo_iconCarrier">
                    <path className="cls-1" d="M21.5,12A9.5,9.5,0,1,0,12,21.5h9.5l-2.66-2.92A9.43,9.43,0,0,0,21.5,12Z" fill='none' stroke='#fff' strokeMiterlimit={10} strokeWidth='1.2px'></path></g></svg>
                </button>
                {post.comments.length}
                <button className={styles.button}>
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M20.5 3.5L3.5 9L10 12L17 7L12 14L15 20.5L20.5 3.5Z" strokeWidth='1.2' stroke="#ffffff" strokeLinecap="round" strokeLinejoin="round"></path> </g></svg>
                </button>
                
                <div className={styles.iconContainer}>
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M11.25 2.0315C11.1701 2.01094 11.0863 2 11 2H8.66667C8.345 2 8.03979 2 7.75 2.00094L7.75002 2.00684V6.25032L11.25 6.25032L11.25 2.0315Z" fill='var(--on-background-matte)'></path> <path d="M11.25 7.75032L2.00195 7.75032L2.00003 7.75032L2 14C2 14.4517 2 14.8673 2.00398 15.2505L2.01927 15.2503H11.25V7.75032Z" fill='var(--on-background-matte)'></path> <path d="M11.25 16.7503L7.75002 16.7503L7.75002 19.9938L7.75 19.9991C8.03979 20 8.345 20 8.66667 20H11.25L11.25 16.7503Z" fill='var(--on-background-matte)'></path> <path d="M6.25002 2.02325C4.64034 2.07802 3.6617 2.26183 2.97631 2.87868C2.22628 3.55371 2.05245 4.54479 2.01216 6.25032L6.25002 6.25032V2.02325Z" fill='var(--on-background-matte)'></path> <path d="M6.25002 16.7503L6.25002 19.9768C4.64034 19.922 3.6617 19.7382 2.97631 19.1213C2.38678 18.5907 2.15323 17.8649 2.0607 16.7503L6.25002 16.7503Z" fill='var(--on-background-matte)'></path> <g opacity="0.5"> <path d="M12.75 7.00596L12.75 7.00032L12.75 6.99468V4H15.3333C15.655 4 15.9602 4 16.25 4.00094L16.25 4.00684V8.25032L12.75 8.25032V7.00596Z" fill='var(--on-background-matte)'></path> <path d="M12.75 16.0059L12.75 16.0003L12.75 15.9947L12.75 9.75032L21.9981 9.75032L22 9.75032L22 16C22 16.4517 22 16.8673 21.996 17.2505L21.9808 17.2503H12.75V16.0059Z" fill='var(--on-background-matte)'></path> <path d="M12.75 21.9685C12.8299 21.9891 12.9137 22 13 22H15.3333C15.655 22 15.9602 22 16.25 21.9991L16.25 21.9938L16.25 18.7503H12.75V21.9685Z" fill='var(--on-background-matte)'></path> <path d="M17.75 8.25032V4.02325C19.3597 4.07802 20.3383 4.26183 21.0237 4.87868C21.7737 5.55371 21.9476 6.54479 21.9878 8.25032L17.75 8.25032Z" fill='var(--on-background-matte)'></path> <path d="M21.9393 18.7503H17.75V21.9768C19.3597 21.922 20.3383 21.7382 21.0237 21.1213C21.6132 20.5907 21.8468 19.8649 21.9393 18.7503Z" fill='var(--on-background-matte)'></path> </g> </g>
                    </svg>
                </div>
            </div>
        </div>
    }
    </>
  )
}
