'use client'
import styles from './PostThumbnail.module.css'
import Image from 'next/image'
import { FetchedPost } from '@/types/Posts.type';
import { useEffect, useRef, useState } from 'react';

interface Props {
  data: FetchedPost & { coverUrl: string };
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
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke='var(--on-background-matte)'><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M21.6602 10.44L20.6802 14.62C19.8402 18.23 18.1802 19.69 15.0602 19.39C14.5602 19.35 14.0202 19.26 13.4402 19.12L11.7602 18.72C7.59018 17.73 6.30018 15.67 7.28018 11.49L8.26018 7.30001C8.46018 6.45001 8.70018 5.71001 9.00018 5.10001C10.1702 2.68001 12.1602 2.03001 15.5002 2.82001L17.1702 3.21001C21.3602 4.19001 22.6402 6.26001 21.6602 10.44Z" stroke="inherit" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path> <path opacity="0.4" d="M15.0603 19.3901C14.4403 19.8101 13.6603 20.1601 12.7103 20.4701L11.1303 20.9901C7.16034 22.2701 5.07034 21.2001 3.78034 17.2301L2.50034 13.2801C1.22034 9.3101 2.28034 7.2101 6.25034 5.9301L7.83034 5.4101C8.24034 5.2801 8.63034 5.1701 9.00034 5.1001C8.70034 5.7101 8.46034 6.4501 8.26034 7.3001L7.28034 11.4901C6.30034 15.6701 7.59034 17.7301 11.7603 18.7201L13.4403 19.1201C14.0203 19.2601 14.5603 19.3501 15.0603 19.3901Z" stroke="inherit" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path> <path opacity="0.4" d="M12.6406 8.52979L17.4906 9.75979" stroke="inherit" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path> <path opacity="0.4" d="M11.6602 12.3999L14.5602 13.1399" stroke="inherit" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path> </g></svg>
            )
        },
        {
            format: 'video',
            icon: (
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke='var(--on-background-matte)'><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M21.0799 8.58003V15.42C21.0799 16.54 20.4799 17.58 19.5099 18.15L13.5699 21.58C12.5999 22.14 11.3999 22.14 10.4199 21.58L4.47992 18.15C3.50992 17.59 2.90991 16.55 2.90991 15.42V8.58003C2.90991 7.46003 3.50992 6.41999 4.47992 5.84999L10.4199 2.42C11.3899 1.86 12.5899 1.86 13.5699 2.42L19.5099 5.84999C20.4799 6.41999 21.0799 7.45003 21.0799 8.58003Z" stroke="inherrit" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path> <path d="M9.75 11.9999V10.7999C9.75 9.25989 10.84 8.62993 12.17 9.39993L13.21 9.9999L14.25 10.5999C15.58 11.3699 15.58 12.6299 14.25 13.3999L13.21 13.9999L12.17 14.5999C10.84 15.3699 9.75 14.7399 9.75 13.1999V11.9999Z" stroke="inherrit" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"></path> </g></svg>
            )
        },
        {
            format: 'photo',
            icon: (
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke='var(--on-background-matte)'>
                    <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                    <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
                    <g id="SVGRepo_iconCarrier">
                        <path d="M3 8.976C3 4.05476 4.05476 3 8.976 3H15.024C19.9452 3 21 4.05476 21 8.976V15.024C21 19.9452 19.9452 21 15.024 21H8.976C4.05476 21 3 19.9452 3 15.024V8.976Z" stroke="inherit" strokeWidth="2"></path>
                        <path d="M17.0045 16.5022L12.7279 12.2256C9.24808 8.74578 7.75642 8.74578 4.27658 12.2256L3 13.5022" stroke="inherit" strokeWidth="2" strokeLinecap="round"></path>
                        <path d="M21 13.6702C18.9068 12.0667 17.4778 12.2919 15.198 14.3459" stroke="inherit" strokeWidth="2" strokeLinecap="round"></path> 
                        <path d="M17 8C17 8.55228 16.5523 9 16 9C15.4477 9 15 8.55228 15 8C15 7.44772 15.4477 7 16 7C16.5523 7 17 7.44772 17 8Z" stroke="inherit" strokeWidth="2"></path> 
                    </g>
                </svg>
            )
        },
        {
            format: 'music',
            icon: (
                <svg  viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                    <g  id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
                    <g id="SVGRepo_iconCarrier"> 
                        <path d="M3 11V13M6 8V16M9 10V14M12 7V17M15 4V20M18 9V15M21 11V13" stroke='var(--on-background-matte)' strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path> 
                    </g>
                </svg>
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
                <svg viewBox="0 0 24 24" height='21px' width='21px' fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M5 8.14307C3.4148 8.66137 3 9.49393 3 10.5V13.5C3 14.6046 3.5 15.5 5.5 16C7.5 16.5 9 21 12 21C12.6098 21 13.0337 19.3265 13.2717 17M3 3L21 21M9 4.60756C9.84604 3.71548 10.8038 3 12 3C12.7739 3 13.2484 5.69533 13.4233 9" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path> </g></svg>
                </button>
                {/* muted */}
                <button className='muted' style={{display: isAudio && !sound ? '':'none', cursor:'pointer'}} onClick={(e) => toggleSound(e)}>
                <svg height='21px' width='21px' viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M22 9L16 15M16 9L22 15M3 10.5V13.5C3 14.6046 3.5 15.5 5.5 16C7.5 16.5 9 21 12 21C14 21 14 3 12 3C9 3 7.5 7.5 5.5 8C3.5 8.5 3 9.39543 3 10.5Z" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path> </g></svg>
                </button>
                {/* unmuted */}
                <button className='unmuted' style={{display: isAudio && sound ? '':'none', cursor:'pointer'}} onClick={(e) => toggleSound(e)}>
                <svg height='21px' width='21px' viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M19 6C20.5 7.5 21 10 21 12C21 14 20.5 16.5 19 18M16 8.99998C16.5 9.49998 17 10.5 17 12C17 13.5 16.5 14.5 16 15M3 10.5V13.5C3 14.6046 3.5 15.5 5.5 16C7.5 16.5 9 21 12 21C14 21 14 3 12 3C9 3 7.5 7.5 5.5 8C3.5 8.5 3 9.39543 3 10.5Z" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path> </g></svg> 
                </button>
            </div>
        }
      <div className={`${styles.postCover}`}>
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
        <div className={styles.coverImage}>
            {
                data.format === 'video' && 
                <video src={`${thumbnailVideoSrc}`} ref={videoRef} className={styles.videoSrc} poster={data.coverThumbnail} muted>
                </video>
            }
            {
                // Check if photo cover is available or not
                (data.coverUrl) ? 
                <Image priority={true} fill key={data._id} src={data.coverUrl} alt={`${data.title}`} sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"></Image> 
                : (data.format === "video") ? '' :
                <Image priority={true} fill key={data._id} src={data.coverThumbnail} alt={`${data.title}`} sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"></Image> 
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
              {matchingIcon?.icon}
            </div>
        </div>
      </div>
    </div>
  );
};

export default PostThumbnail;