'use client'
import { FetchedPost } from '@/types/Posts.type'
import React, { useEffect, useState } from 'react'
import { BackButton } from '../Button/BackButton';
import styles from './VideoPage.module.css'
import Image from 'next/image';
import { getAuthor } from '@/utils/getTeam';
import { Teammate } from '@/types/User.type';

type Props = {
    post: FetchedPost,
    videoUrl: string[],
    coverUrl: string
}
export const VideoPage: React.FC<Props> = ({post, videoUrl, coverUrl} ) => {
    const [author, setAuthor] = useState<Teammate>()
    // Toggle Description
    const [descActive, setDescActive] = useState(false);
    const handleToggleDesc = () => {
        setDescActive(!descActive);
    }
    useEffect(() => {
        if(!descActive) {
            // Scroll the description to the top when becoming deactive
            const postDesc = document.getElementById('postDesc');
            if (postDesc) {
                postDesc.scrollTop = 0;
            }
        }
    }, [descActive])

    // Fetch author thumbnail
    const handleAuthor = async () => {
        const res = await getAuthor(post.author);
        setAuthor((await res).author)
    }
    useEffect(() => {
        handleAuthor();
    }, [])
  return (
    <>
    <BackButton/>
    <div className={post.coverRes.height > post.coverRes.width ? styles.portraitPost : styles.landscapePost}>
            <div className={styles.postCover}>
                <video className={styles.videoSrc} src={videoUrl[0]} poster={coverUrl} muted autoPlay loop>
                </video>
            </div>
            <div className={`${styles.postOverlay} ${descActive && styles.active}`}/>
            <div className={styles.postInfo}>
                <div className={`${styles.postCat}`}>
                    <Image alt={`on ${post.category}`} src={`/assets/images/on ${post.category}.png`} height={25} width={25}/>
                    <span>on {post.category}</span>
                </div>
                <div className={styles.titlePost}>
                    <h1>{post.title}</h1>
                </div>
                <div onClick={handleToggleDesc} id='postDesc' className={`${styles.postDesc} ${!descActive ? styles.deactive : styles.active}`}>
                    {post.desc}
                </div>
            </div>
            <div className={styles.postSocial}>
                <button className={styles.button}>
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="var(--on-background)" strokeWidth="0"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M12 5.50063L11.4596 6.02073C11.463 6.02421 11.4664 6.02765 11.4698 6.03106L12 5.50063ZM8.96173 18.9109L8.49742 19.4999L8.96173 18.9109ZM15.0383 18.9109L14.574 18.3219L15.0383 18.9109ZM7.00061 16.4209C6.68078 16.1577 6.20813 16.2036 5.94491 16.5234C5.68169 16.8432 5.72758 17.3159 6.04741 17.5791L7.00061 16.4209ZM2.34199 13.4115C2.54074 13.7749 2.99647 13.9084 3.35988 13.7096C3.7233 13.5108 3.85677 13.0551 3.65801 12.6917L2.34199 13.4115ZM13.4698 8.03034C13.7627 8.32318 14.2376 8.32309 14.5304 8.03014C14.8233 7.7372 14.8232 7.26232 14.5302 6.96948L13.4698 8.03034ZM2.75 9.1371C2.75 6.98623 3.96537 5.18252 5.62436 4.42419C7.23607 3.68748 9.40166 3.88258 11.4596 6.02073L12.5404 4.98053C10.0985 2.44352 7.26409 2.02539 5.00076 3.05996C2.78471 4.07292 1.25 6.42503 1.25 9.1371H2.75ZM8.49742 19.4999C9.00965 19.9037 9.55955 20.3343 10.1168 20.6599C10.6739 20.9854 11.3096 21.25 12 21.25V19.75C11.6904 19.75 11.3261 19.6293 10.8736 19.3648C10.4213 19.1005 9.95208 18.7366 9.42605 18.3219L8.49742 19.4999ZM15.5026 19.4999C16.9292 18.3752 18.7528 17.0866 20.1833 15.4758C21.6395 13.8361 22.75 11.8026 22.75 9.1371H21.25C21.25 11.3345 20.3508 13.0282 19.0617 14.4798C17.7469 15.9603 16.0896 17.1271 14.574 18.3219L15.5026 19.4999ZM22.75 9.1371C22.75 6.42503 21.2153 4.07292 18.9992 3.05996C16.7359 2.02539 13.9015 2.44352 11.4596 4.98053L12.5404 6.02073C14.5983 3.88258 16.7639 3.68748 18.3756 4.42419C20.0346 5.18252 21.25 6.98623 21.25 9.1371H22.75ZM14.574 18.3219C14.0479 18.7366 13.5787 19.1005 13.1264 19.3648C12.6739 19.6293 12.3096 19.75 12 19.75V21.25C12.6904 21.25 13.3261 20.9854 13.8832 20.6599C14.4405 20.3343 14.9903 19.9037 15.5026 19.4999L14.574 18.3219ZM9.42605 18.3219C8.63014 17.6945 7.82129 17.0963 7.00061 16.4209L6.04741 17.5791C6.87768 18.2624 7.75472 18.9144 8.49742 19.4999L9.42605 18.3219ZM3.65801 12.6917C3.0968 11.6656 2.75 10.5033 2.75 9.1371H1.25C1.25 10.7746 1.66995 12.1827 2.34199 13.4115L3.65801 12.6917ZM11.4698 6.03106L13.4698 8.03034L14.5302 6.96948L12.5302 4.97021L11.4698 6.03106Z" fill="var(--on-background)"></path> </g></svg>
                </button>
                {post.likes > 0 && post.likes}
                <button className={styles.button}>
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M8 10.5H16" stroke="var(--on-background-matte)" strokeWidth="1" strokeLinecap="round"></path> <path d="M8 14H13.5" stroke="var(--on-background-matte)" strokeWidth="1" strokeLinecap="round"></path> <path d="M17 3.33782C15.5291 2.48697 13.8214 2 12 2C6.47715 2 2 6.47715 2 12C2 13.5997 2.37562 15.1116 3.04346 16.4525C3.22094 16.8088 3.28001 17.2161 3.17712 17.6006L2.58151 19.8267C2.32295 20.793 3.20701 21.677 4.17335 21.4185L6.39939 20.8229C6.78393 20.72 7.19121 20.7791 7.54753 20.9565C8.88837 21.6244 10.4003 22 12 22C17.5228 22 22 17.5228 22 12C22 10.1786 21.513 8.47087 20.6622 7" stroke="var(--on-background)" strokeWidth="1.5" strokeLinecap="round"></path> </g></svg>
                </button>
                {post.comments.length > 0 && post.comments.length}
                <button className={styles.button}>
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M7.39969 6.32015L15.8897 3.49015C19.6997 2.22015 21.7697 4.30015 20.5097 8.11015L17.6797 16.6002C15.7797 22.3102 12.6597 22.3102 10.7597 16.6002L9.91969 14.0802L7.39969 13.2402C1.68969 11.3402 1.68969 8.23015 7.39969 6.32015Z" stroke="var(--on-background)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path> <path opacity="0.34" d="M10.1094 13.6501L13.6894 10.0601" stroke="var(--on-background)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path> </g></svg>
                </button>
                <div className={styles.postAuthor}>
                    <img src={author?.avatar} alt={author?.name}></img>
                </div>
                {/* <div className={styles.iconContainer}>
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M11.25 2.0315C11.1701 2.01094 11.0863 2 11 2H8.66667C8.345 2 8.03979 2 7.75 2.00094L7.75002 2.00684V6.25032L11.25 6.25032L11.25 2.0315Z" fill='var(--on-background-matte)'></path> <path d="M11.25 7.75032L2.00195 7.75032L2.00003 7.75032L2 14C2 14.4517 2 14.8673 2.00398 15.2505L2.01927 15.2503H11.25V7.75032Z" fill='var(--on-background-matte)'></path> <path d="M11.25 16.7503L7.75002 16.7503L7.75002 19.9938L7.75 19.9991C8.03979 20 8.345 20 8.66667 20H11.25L11.25 16.7503Z" fill='var(--on-background-matte)'></path> <path d="M6.25002 2.02325C4.64034 2.07802 3.6617 2.26183 2.97631 2.87868C2.22628 3.55371 2.05245 4.54479 2.01216 6.25032L6.25002 6.25032V2.02325Z" fill='var(--on-background-matte)'></path> <path d="M6.25002 16.7503L6.25002 19.9768C4.64034 19.922 3.6617 19.7382 2.97631 19.1213C2.38678 18.5907 2.15323 17.8649 2.0607 16.7503L6.25002 16.7503Z" fill='var(--on-background-matte)'></path> <g opacity="0.5"> <path d="M12.75 7.00596L12.75 7.00032L12.75 6.99468V4H15.3333C15.655 4 15.9602 4 16.25 4.00094L16.25 4.00684V8.25032L12.75 8.25032V7.00596Z" fill='var(--on-background-matte)'></path> <path d="M12.75 16.0059L12.75 16.0003L12.75 15.9947L12.75 9.75032L21.9981 9.75032L22 9.75032L22 16C22 16.4517 22 16.8673 21.996 17.2505L21.9808 17.2503H12.75V16.0059Z" fill='var(--on-background-matte)'></path> <path d="M12.75 21.9685C12.8299 21.9891 12.9137 22 13 22H15.3333C15.655 22 15.9602 22 16.25 21.9991L16.25 21.9938L16.25 18.7503H12.75V21.9685Z" fill='var(--on-background-matte)'></path> <path d="M17.75 8.25032V4.02325C19.3597 4.07802 20.3383 4.26183 21.0237 4.87868C21.7737 5.55371 21.9476 6.54479 21.9878 8.25032L17.75 8.25032Z" fill='var(--on-background-matte)'></path> <path d="M21.9393 18.7503H17.75V21.9768C19.3597 21.922 20.3383 21.7382 21.0237 21.1213C21.6132 20.5907 21.8468 19.8649 21.9393 18.7503Z" fill='var(--on-background-matte)'></path> </g> </g>
                    </svg>
                </div> */}
            </div>
        </div>
    </>
  )
}
