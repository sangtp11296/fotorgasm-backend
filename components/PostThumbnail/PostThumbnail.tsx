'use client'
import styles from './PostThumbnail.module.css'
import Image from 'next/image'
import { DraftPost, FetchedPost } from '@/types/Posts.type';
import { useEffect, useRef, useState } from 'react';

interface Props {
//   data: FetchedPost & { coverUrl: string };
    data: DraftPost
}
// Generate type for icons
interface iconsObj {
    format: string;
    icon: JSX.Element;
}
const PostThumbnail: React.FC<Props> = ({ data }) => {

    // Fetch video thumbnail
    const [thumbnailVideoSrc, setThumbnailVideoSrc] = useState();
    async function handleFetchThumbnailVideo (){
        if (data.format === 'video') {
            const res = await fetch('https://vjbjtwm3k8.execute-api.ap-southeast-1.amazonaws.com/dev/get-draft-image', {
                method: 'POST',
                body: JSON.stringify({
                    key: data.videoSrc?.low,
                })
            })
    
            const fetchedData = await res.json();
            setThumbnailVideoSrc(fetchedData.presignedUrl);
        }
    }
    useEffect(() => {
        handleFetchThumbnailVideo();
    }, [])

    // Video format
    const [isAudio, setAudio] = useState<boolean>();
    const [sound, setSound] = useState<boolean>()
    const videoRef = useRef<HTMLVideoElement>(null);

        // Hover to Play video
    let timeoutID: NodeJS.Timeout;
    const handleHoverPlay = () => {
        timeoutID = setTimeout(() => {
        if (videoRef.current){
            videoRef.current.play();
            setTimeout(() => {
            if (
                (videoRef.current as any).mozHasAudio || 
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
            }, 100);
        }
        }, 1500);
    }
    const handleHoverStop = () => {
        clearTimeout(timeoutID);
        if (videoRef.current){
        videoRef.current.pause();
        videoRef.current.currentTime = 0;
        videoRef.current.muted = true;
        videoRef.current.load(); /* parks the video back to its poster */
        setAudio(false);
        setSound(false);
        }
    }

    // Toggle sound
    const toggleSound = (e: React.MouseEvent) => {
        // Prevent ScrollToElement function from triggering
        e.stopPropagation();
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

    const icons: iconsObj[] = [
        {
            format: 'blog',
            icon: (
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fillRule="evenodd" clipRule="evenodd" d="M20.8293 10.7154L20.3116 12.6473C19.7074 14.9024 19.4052 16.0299 18.7203 16.7612C18.1795 17.3386 17.4796 17.7427 16.7092 17.9223C16.6129 17.9448 16.5152 17.9621 16.415 17.9744C15.4999 18.0873 14.3834 17.7881 12.3508 17.2435C10.0957 16.6392 8.96815 16.3371 8.23687 15.6522C7.65945 15.1114 7.25537 14.4115 7.07573 13.641C6.84821 12.6652 7.15033 11.5377 7.75458 9.28263L8.27222 7.35077C8.3591 7.02654 8.43979 6.7254 8.51621 6.44561C8.97128 4.77957 9.27709 3.86298 9.86351 3.23687C10.4043 2.65945 11.1042 2.25537 11.8747 2.07573C12.8504 1.84821 13.978 2.15033 16.2331 2.75458C18.4881 3.35883 19.6157 3.66095 20.347 4.34587C20.9244 4.88668 21.3285 5.58657 21.5081 6.35703C21.7356 7.3328 21.4335 8.46034 20.8293 10.7154ZM11.0524 9.80589C11.1596 9.40579 11.5709 9.16835 11.971 9.27556L16.8006 10.5697C17.2007 10.6769 17.4381 11.0881 17.3309 11.4882C17.2237 11.8883 16.8125 12.1257 16.4124 12.0185L11.5827 10.7244C11.1826 10.6172 10.9452 10.206 11.0524 9.80589ZM10.2756 12.7033C10.3828 12.3032 10.794 12.0658 11.1941 12.173L14.0919 12.9495C14.492 13.0567 14.7294 13.4679 14.6222 13.868C14.515 14.2681 14.1038 14.5056 13.7037 14.3984L10.8059 13.6219C10.4058 13.5147 10.1683 13.1034 10.2756 12.7033Z" fill='var(--on-background-matte)'></path> <path opacity="0.5" d="M16.4149 17.9745C16.2064 18.6128 15.8398 19.1903 15.347 19.6519C14.6157 20.3368 13.4881 20.6389 11.2331 21.2432C8.97798 21.8474 7.85044 22.1496 6.87466 21.922C6.10421 21.7424 5.40432 21.3383 4.86351 20.7609C4.17859 20.0296 3.87647 18.9021 3.27222 16.647L2.75458 14.7152C2.15033 12.4601 1.84821 11.3325 2.07573 10.3568C2.25537 9.5863 2.65945 8.88641 3.23687 8.3456C3.96815 7.66068 5.09569 7.35856 7.35077 6.75431C7.7774 6.64 8.16369 6.53649 8.51621 6.44534C8.51618 6.44545 8.51624 6.44524 8.51621 6.44534C8.43979 6.72513 8.3591 7.02657 8.27222 7.35081L7.75458 9.28266C7.15033 11.5377 6.84821 12.6653 7.07573 13.6411C7.25537 14.4115 7.65945 15.1114 8.23687 15.6522C8.96815 16.3371 10.0957 16.6393 12.3508 17.2435C14.3833 17.7881 15.4999 18.0873 16.4149 17.9745Z" fill='var(--on-background-matte)'></path> </g></svg>
            )
        },
        {
            format: 'video',
            icon: (
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M11.25 2.0315C11.1701 2.01094 11.0863 2 11 2H8.66667C8.345 2 8.03979 2 7.75 2.00094L7.75002 2.00684V6.25032L11.25 6.25032L11.25 2.0315Z" fill='var(--on-background-matte)'></path> <path d="M11.25 7.75032L2.00195 7.75032L2.00003 7.75032L2 14C2 14.4517 2 14.8673 2.00398 15.2505L2.01927 15.2503H11.25V7.75032Z" fill='var(--on-background-matte)'></path> <path d="M11.25 16.7503L7.75002 16.7503L7.75002 19.9938L7.75 19.9991C8.03979 20 8.345 20 8.66667 20H11.25L11.25 16.7503Z" fill='var(--on-background-matte)'></path> <path d="M6.25002 2.02325C4.64034 2.07802 3.6617 2.26183 2.97631 2.87868C2.22628 3.55371 2.05245 4.54479 2.01216 6.25032L6.25002 6.25032V2.02325Z" fill='var(--on-background-matte)'></path> <path d="M6.25002 16.7503L6.25002 19.9768C4.64034 19.922 3.6617 19.7382 2.97631 19.1213C2.38678 18.5907 2.15323 17.8649 2.0607 16.7503L6.25002 16.7503Z" fill='var(--on-background-matte)'></path> <g opacity="0.5"> <path d="M12.75 7.00596L12.75 7.00032L12.75 6.99468V4H15.3333C15.655 4 15.9602 4 16.25 4.00094L16.25 4.00684V8.25032L12.75 8.25032V7.00596Z" fill='var(--on-background-matte)'></path> <path d="M12.75 16.0059L12.75 16.0003L12.75 15.9947L12.75 9.75032L21.9981 9.75032L22 9.75032L22 16C22 16.4517 22 16.8673 21.996 17.2505L21.9808 17.2503H12.75V16.0059Z" fill='var(--on-background-matte)'></path> <path d="M12.75 21.9685C12.8299 21.9891 12.9137 22 13 22H15.3333C15.655 22 15.9602 22 16.25 21.9991L16.25 21.9938L16.25 18.7503H12.75V21.9685Z" fill='var(--on-background-matte)'></path> <path d="M17.75 8.25032V4.02325C19.3597 4.07802 20.3383 4.26183 21.0237 4.87868C21.7737 5.55371 21.9476 6.54479 21.9878 8.25032L17.75 8.25032Z" fill='var(--on-background-matte)'></path> <path d="M21.9393 18.7503H17.75V21.9768C19.3597 21.922 20.3383 21.7382 21.0237 21.1213C21.6132 20.5907 21.8468 19.8649 21.9393 18.7503Z" fill='var(--on-background-matte)'></path> </g> </g></svg>
            )
        },
        {
            format: 'photo',
            icon: (
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path opacity="1" d="M11.1822 15.3618L6.89249 11.0721C6.03628 10.2159 4.66286 10.1702 3.75159 10.9675L2.751 11.8623C2.73407 11.8751 2.7002 11.9607 2.7002 12.2004C2.7002 17.3366 6.86395 21.5004 12.0002 21.5004C15.2197 21.5004 18.057 19.8645 19.7264 17.3786L19.609 17.2612L17.7765 15.599C16.7369 14.6634 15.1888 14.5702 14.0446 15.3744L13.7464 15.5839C12.9512 16.1428 11.8694 16.0491 11.1822 15.3618Z" fill='var(--on-background-matte)'></path> <path opacity=".5" d="M15 11C16.1046 11 17 10.1046 17 9C17 7.89543 16.1046 7 15 7C13.8954 7 13 7.89543 13 9C13 10.1046 13.8954 11 15 11Z" fill='var(--on-background-matte)'></path> <path fillRule="evenodd" clipRule="evenodd" d="M1.25 12C1.25 6.06294 6.06294 1.25 12 1.25C17.9371 1.25 22.75 6.06294 22.75 12C22.75 17.9371 17.9371 22.75 12 22.75C6.06294 22.75 1.25 17.9371 1.25 12ZM20.9794 9.76985C21.1886 10.5446 21.3002 11.3595 21.3002 12.2004C21.3002 17.3366 17.1364 21.5004 12.0002 21.5004C6.86395 21.5004 2.7002 17.3366 2.7002 12.2004C2.7002 11.3658 2.81014 10.5568 3.01634 9.78724C4.00808 5.74714 7.65403 2.75 12 2.75C16.3397 2.75 19.9814 5.73854 20.9794 9.76985Z" fill='var(--on-background-matte)'></path> </g></svg>
            )
        },
        {
            format: 'music',
            icon: (
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M9 13.25C6.37665 13.25 4.25 15.3766 4.25 18C4.25 20.6234 6.37665 22.75 9 22.75C11.6234 22.75 13.75 20.6234 13.75 18C13.75 15.3766 11.6234 13.25 9 13.25Z" fill='var(--on-background-matte)'></path> <path fillRule="evenodd" clipRule="evenodd" d="M13 1.25C13.4142 1.25 13.75 1.58579 13.75 2C13.75 4.8995 16.1005 7.25 19 7.25C19.4142 7.25 19.75 7.58579 19.75 8C19.75 8.41421 19.4142 8.75 19 8.75C15.2721 8.75 12.25 5.72792 12.25 2C12.25 1.58579 12.5858 1.25 13 1.25Z" fill='var(--on-background-matte)'></path> <path opacity="0.5" d="M12.25 14.5359V2C12.25 3.60747 12.8119 5.08371 13.75 6.243V18C13.75 16.6339 13.1733 15.4024 12.25 14.5359Z" fill='var(--on-background-matte)'></path> </g></svg>
            )
        },
    ];
    // Find the corresponding icon based on data.format
    const matchingIcon = icons.find((icon) => icon.format === data.format);
    
  return (
    <div id={data._id} className={`${styles.postThumbnail}`} onMouseEnter={data.format==='video' ? handleHoverPlay : undefined} onMouseLeave={data.format==='video' ? handleHoverStop : undefined}>
        {
            data.format === 'video' &&
            <div className={styles.videoAudio}>
                {/* no sound */}
                <button style={{display: !isAudio ? '' : 'none', scale:'none', opacity:'.5'}} disabled>
                <svg viewBox="0 0 24 24" height='21px' width='21px' fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M5 8.14307C3.4148 8.66137 3 9.49393 3 10.5V13.5C3 14.6046 3.5 15.5 5.5 16C7.5 16.5 9 21 12 21C12.6098 21 13.0337 19.3265 13.2717 17M3 3L21 21M9 4.60756C9.84604 3.71548 10.8038 3 12 3C12.7739 3 13.2484 5.69533 13.4233 9" stroke="var(--on-background)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path> </g></svg>
                </button>
                {/* muted */}
                <button className='muted' style={{display: isAudio && !sound ? '':'none', cursor:'pointer'}} onClick={(e) => toggleSound(e)}>
                <svg height='21px' width='21px' viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M22 9L16 15M16 9L22 15M3 10.5V13.5C3 14.6046 3.5 15.5 5.5 16C7.5 16.5 9 21 12 21C14 21 14 3 12 3C9 3 7.5 7.5 5.5 8C3.5 8.5 3 9.39543 3 10.5Z" stroke="var(--on-background)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path> </g></svg>
                </button>
                {/* unmuted */}
                <button className='unmuted' style={{display: isAudio && sound ? '':'none', cursor:'pointer'}} onClick={(e) => toggleSound(e)}>
                <svg height='21px' width='21px' viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M19 6C20.5 7.5 21 10 21 12C21 14 20.5 16.5 19 18M16 8.99998C16.5 9.49998 17 10.5 17 12C17 13.5 16.5 14.5 16 15M3 10.5V13.5C3 14.6046 3.5 15.5 5.5 16C7.5 16.5 9 21 12 21C14 21 14 3 12 3C9 3 7.5 7.5 5.5 8C3.5 8.5 3 9.39543 3 10.5Z" stroke="var(--on-background)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path> </g></svg> 
                </button>
            </div>
        }
      <div className={`${styles.postCover}`}>
        <button className={styles.fullScreen}>
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path opacity="0.5" d="M12.9999 21.9994C17.055 21.9921 19.1784 21.8926 20.5354 20.5355C21.9999 19.0711 21.9999 16.714 21.9999 12C21.9999 7.28595 21.9999 4.92893 20.5354 3.46447C19.071 2 16.714 2 11.9999 2C7.28587 2 4.92884 2 3.46438 3.46447C2.10734 4.8215 2.00779 6.94493 2.00049 11" stroke="var(--on-background)" strokeWidth="1.5" strokeLinecap="round"></path> <path d="M12 12L17 7M17 7H13.25M17 7V10.75" stroke="var(--on-background)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path> <path d="M2 18C2 16.1144 2 15.1716 2.58579 14.5858C3.17157 14 4.11438 14 6 14C7.88562 14 8.82843 14 9.41421 14.5858C10 15.1716 10 16.1144 10 18C10 19.8856 10 20.8284 9.41421 21.4142C8.82843 22 7.88562 22 6 22C4.11438 22 3.17157 22 2.58579 21.4142C2 20.8284 2 19.8856 2 18Z" stroke="var(--on-background)" strokeWidth="1.5"></path> </g></svg>
        </button>
        <div className={styles.coverImage}>
            {
                data.format === 'video' && 
                <video src={`${thumbnailVideoSrc}`} ref={videoRef} className={styles.videoSrc} poster={data.coverThumbnail} muted>
                </video>
            }
            {
                // Check if photo cover is available or not
                (data.coverUrl) ? 
                <Image priority={true} fill key={data._id} src={data.coverUrl} alt={`${data.title}`} sizes="(maxWidth: 768px) 100vw, (maxWidth: 1200px) 50vw, 33vw"></Image> 
                : (data.format === "video") ? '' :
                <Image priority={true} fill key={data._id} src={data.coverThumbnail} alt={`${data.title}`} sizes="(maxWidth: 768px) 100vw, (maxWidth: 1200px) 50vw, 33vw"></Image> 
            }
          
        </div>
        <div className={`${styles.postOverlay}`}/>
        <div className={styles.postInfo}>
            <div className={`${styles.postCat}`}>
                <Image alt={`on ${data.category}`} src={`/assets/images/on ${data.category}.png`} height={25} width={25}/>
                <span>on {data.category}</span>
            </div>
            <div className={styles.titlePost}>
                <h2>{data.title}</h2>
            </div>
            <div className={styles.postDesc}>
                {data.desc}
            </div>
        </div>
        <div className={styles.postSocial}>
            <button className={styles.button}>
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="var(--on-background)" strokeWidth="0"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M12 5.50063L11.4596 6.02073C11.463 6.02421 11.4664 6.02765 11.4698 6.03106L12 5.50063ZM8.96173 18.9109L8.49742 19.4999L8.96173 18.9109ZM15.0383 18.9109L14.574 18.3219L15.0383 18.9109ZM7.00061 16.4209C6.68078 16.1577 6.20813 16.2036 5.94491 16.5234C5.68169 16.8432 5.72758 17.3159 6.04741 17.5791L7.00061 16.4209ZM2.34199 13.4115C2.54074 13.7749 2.99647 13.9084 3.35988 13.7096C3.7233 13.5108 3.85677 13.0551 3.65801 12.6917L2.34199 13.4115ZM13.4698 8.03034C13.7627 8.32318 14.2376 8.32309 14.5304 8.03014C14.8233 7.7372 14.8232 7.26232 14.5302 6.96948L13.4698 8.03034ZM2.75 9.1371C2.75 6.98623 3.96537 5.18252 5.62436 4.42419C7.23607 3.68748 9.40166 3.88258 11.4596 6.02073L12.5404 4.98053C10.0985 2.44352 7.26409 2.02539 5.00076 3.05996C2.78471 4.07292 1.25 6.42503 1.25 9.1371H2.75ZM8.49742 19.4999C9.00965 19.9037 9.55955 20.3343 10.1168 20.6599C10.6739 20.9854 11.3096 21.25 12 21.25V19.75C11.6904 19.75 11.3261 19.6293 10.8736 19.3648C10.4213 19.1005 9.95208 18.7366 9.42605 18.3219L8.49742 19.4999ZM15.5026 19.4999C16.9292 18.3752 18.7528 17.0866 20.1833 15.4758C21.6395 13.8361 22.75 11.8026 22.75 9.1371H21.25C21.25 11.3345 20.3508 13.0282 19.0617 14.4798C17.7469 15.9603 16.0896 17.1271 14.574 18.3219L15.5026 19.4999ZM22.75 9.1371C22.75 6.42503 21.2153 4.07292 18.9992 3.05996C16.7359 2.02539 13.9015 2.44352 11.4596 4.98053L12.5404 6.02073C14.5983 3.88258 16.7639 3.68748 18.3756 4.42419C20.0346 5.18252 21.25 6.98623 21.25 9.1371H22.75ZM14.574 18.3219C14.0479 18.7366 13.5787 19.1005 13.1264 19.3648C12.6739 19.6293 12.3096 19.75 12 19.75V21.25C12.6904 21.25 13.3261 20.9854 13.8832 20.6599C14.4405 20.3343 14.9903 19.9037 15.5026 19.4999L14.574 18.3219ZM9.42605 18.3219C8.63014 17.6945 7.82129 17.0963 7.00061 16.4209L6.04741 17.5791C6.87768 18.2624 7.75472 18.9144 8.49742 19.4999L9.42605 18.3219ZM3.65801 12.6917C3.0968 11.6656 2.75 10.5033 2.75 9.1371H1.25C1.25 10.7746 1.66995 12.1827 2.34199 13.4115L3.65801 12.6917ZM11.4698 6.03106L13.4698 8.03034L14.5302 6.96948L12.5302 4.97021L11.4698 6.03106Z" fill="var(--on-background)"></path> </g></svg>
            </button>
            {randomNum()}
            <button className={styles.button}>
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M8 10.5H16" stroke="var(--on-background-matte)" strokeWidth="1" strokeLinecap="round"></path> <path d="M8 14H13.5" stroke="var(--on-background-matte)" strokeWidth="1" strokeLinecap="round"></path> <path d="M17 3.33782C15.5291 2.48697 13.8214 2 12 2C6.47715 2 2 6.47715 2 12C2 13.5997 2.37562 15.1116 3.04346 16.4525C3.22094 16.8088 3.28001 17.2161 3.17712 17.6006L2.58151 19.8267C2.32295 20.793 3.20701 21.677 4.17335 21.4185L6.39939 20.8229C6.78393 20.72 7.19121 20.7791 7.54753 20.9565C8.88837 21.6244 10.4003 22 12 22C17.5228 22 22 17.5228 22 12C22 10.1786 21.513 8.47087 20.6622 7" stroke="var(--on-background)" strokeWidth="1.5" strokeLinecap="round"></path> </g></svg>
            </button>
            {randomNum()}
            <button className={styles.button}>
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M7.39969 6.32015L15.8897 3.49015C19.6997 2.22015 21.7697 4.30015 20.5097 8.11015L17.6797 16.6002C15.7797 22.3102 12.6597 22.3102 10.7597 16.6002L9.91969 14.0802L7.39969 13.2402C1.68969 11.3402 1.68969 8.23015 7.39969 6.32015Z" stroke="var(--on-background)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path> <path opacity="0.34" d="M10.1094 13.6501L13.6894 10.0601" stroke="var(--on-background)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path> </g></svg>
            </button>
            {randomNum()}
            <div className={styles.iconContainer}>
              {matchingIcon?.icon}
            </div>
        </div>
      </div>
    </div>
  );
};

export default PostThumbnail;