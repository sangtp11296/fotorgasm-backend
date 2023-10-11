'use client'
import { FetchedPost } from '@/types/Posts.type'
import React, { useEffect, useRef, useState } from 'react'
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
    const [author, setAuthor] = useState<Teammate>()
    const handleAuthor = async () => {
        const res = await getAuthor(post.author);
        setAuthor((await res).author)
    }
    useEffect(() => {
        handleAuthor();
    }, [])

    // Video format
    const [isAudio, setAudio] = useState<boolean>();
    const [sound, setSound] = useState<boolean>()
    const videoRef = useRef<HTMLVideoElement>(null);
    const [play, setPlay] = useState<boolean>(true);
    // Check audio is available or not
    useEffect(() => {
        setTimeout(() => {
            if ((videoRef.current as any).mozHasAudio || 
                Boolean((videoRef.current as any).webkitAudioDecodedByteCount) || 
                Boolean((videoRef.current as any).audioTracks && 
                (videoRef.current as any).audioTracks.length)){
                    if(videoRef.current?.muted){
                        setAudio(true);
                        setSound(false);
                    }
            } else {
                setAudio(false);
                setSound(false);
            }
        }, 1500)
    },[videoRef.current])
    const toggleSound = (e: React.MouseEvent) => {
        // Prevent ScrollToElement function from triggering
        // e.stopPropagation();
        // Prevent reloading
        e.preventDefault();
        if (videoRef.current){
            videoRef.current.muted = !videoRef.current.muted;
        if (sound){
            setSound(false);
        } else if (!sound){
            setSound(true);
        }
        }
    }
    const togglePlayPause = (e: React.MouseEvent) => {
        e.preventDefault();
        if(videoRef.current){
            if(play){
                videoRef.current.pause();
                setPlay(false);
            } else {
                videoRef.current.play();
                setPlay(true)
            }
        }
    }
  return (
    <>
    <div className={`${styles.videoPost} ${post.coverRes.height > post.coverRes.width ? styles.portraitPost : styles.landscapePost}`} >
        <div className={styles.videoAudio}>
            {/* no sound */}
            <button style={{display: !isAudio ? '' : 'none', scale:'none', opacity:'.5'}} disabled>
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M5 8.14307C3.4148 8.66137 3 9.49393 3 10.5V13.5C3 14.6046 3.5 15.5 5.5 16C7.5 16.5 9 21 12 21C12.6098 21 13.0337 19.3265 13.2717 17M3 3L21 21M9 4.60756C9.84604 3.71548 10.8038 3 12 3C12.7739 3 13.2484 5.69533 13.4233 9" stroke="var(--on-background)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path> </g></svg>
            </button>
            {/* muted */}
            <button className='muted' style={{display: isAudio && !sound ? '':'none', cursor:'pointer'}} onClick={(e) => toggleSound(e)}>
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M22 9L16 15M16 9L22 15M3 10.5V13.5C3 14.6046 3.5 15.5 5.5 16C7.5 16.5 9 21 12 21C14 21 14 3 12 3C9 3 7.5 7.5 5.5 8C3.5 8.5 3 9.39543 3 10.5Z" stroke="var(--on-background)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path> </g></svg>
            </button>
            {/* unmuted */}
            <button className='unmuted' style={{display: isAudio && sound ? '':'none', cursor:'pointer'}} onClick={(e) => toggleSound(e)}>
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M19 6C20.5 7.5 21 10 21 12C21 14 20.5 16.5 19 18M16 8.99998C16.5 9.49998 17 10.5 17 12C17 13.5 16.5 14.5 16 15M3 10.5V13.5C3 14.6046 3.5 15.5 5.5 16C7.5 16.5 9 21 12 21C14 21 14 3 12 3C9 3 7.5 7.5 5.5 8C3.5 8.5 3 9.39543 3 10.5Z" stroke="var(--on-background)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path> </g></svg> 
            </button>
        </div>
        <div className={styles.postCover} onClick={togglePlayPause}>
            <video className={styles.videoSrc} ref={videoRef} src={videoUrl[0]} poster={coverUrl} muted autoPlay loop>
            </video>
            <button className={play ? styles.visible : ''}>
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M18.7 8.97989L4.14 17.7099C4.05 17.3799 4 17.0299 4 16.6699V7.32989C4 4.24989 7.33 2.32989 10 3.86989L14.04 6.19989L18.09 8.53989C18.31 8.66989 18.52 8.80989 18.7 8.97989Z" fill="#ffffff"></path> <path opacity="0.4" d="M18.0907 15.4598L14.0407 17.7998L10.0007 20.1298C8.0907 21.2298 5.8407 20.5698 4.7207 18.9598L5.1407 18.7098L19.5807 10.0498C20.5807 11.8498 20.0907 14.3098 18.0907 15.4598Z" fill="#ffffff"></path> </g></svg>
            </button>
            <button className={!play ? styles.visible : ''}>
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M10.65 19.11V4.89C10.65 3.54 10.08 3 8.64 3H5.01C3.57 3 3 3.54 3 4.89V19.11C3 20.46 3.57 21 5.01 21H8.64C10.08 21 10.65 20.46 10.65 19.11Z" fill="#ffffff"></path> <path opacity="0.4" d="M20.9996 19.11V4.89C20.9996 3.54 20.4296 3 18.9896 3H15.3596C13.9296 3 13.3496 3.54 13.3496 4.89V19.11C13.3496 20.46 13.9196 21 15.3596 21H18.9896C20.4296 21 20.9996 20.46 20.9996 19.11Z" fill="#ffffff"></path> </g></svg>
            </button>
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
        </div>
    </div>
    </>
  )
}
