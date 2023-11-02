'use client'
import styles from './PostThumbnail.module.css'
import Image from 'next/image'
import { DraftPost, FetchedPost } from '@/types/Posts.type';
import { useEffect, useRef, useState } from 'react';
import { BlogIcon, CommentIcon, FullScreenIcon, HeartIcon, MusicIcon, PhotoIcon, ShareIcon, VideoIcon } from '../ButtonIcon/StaticIcons';

interface Props {
//   data: FetchedPost & { coverUrl: string };
    data: DraftPost | FetchedPost
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
            const res = await fetch('https://4esg1vvhi3.execute-api.ap-southeast-1.amazonaws.com/dev/get-file', {
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
                <BlogIcon color='var(--on-background-matte)'/>
            )
        },
        {
            format: 'video',
            icon: (
                <VideoIcon color='var(--on-background-matte)'/>
            )
        },
        {
            format: 'photo',
            icon: (
                <PhotoIcon color='var(--on-background-matte)'/>
            )
        },
        {
            format: 'music',
            icon: (
                <MusicIcon color='var(--on-background-matte)'/>
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
            <FullScreenIcon color="var(--on-background)" />
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
                <HeartIcon color='var(--on-background)'/>
            </button>
            {randomNum()}
            <button className={styles.button}>
                <CommentIcon color1='var(--on-background)' color2='var(--on-background-matte)'/>
            </button>
            {randomNum()}
            <button className={styles.button}>
                <ShareIcon color='var(--on-background)'/>
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