'use client'
import { FetchAlbum, Song } from '@/types/Album.type'
import React, { useEffect, useRef, useState } from 'react'
import styles from './Album.module.css'
import { Shuffle } from '../Button/Shuffle'
import { OnPlayingPlayer } from '../OnPlayingPlayer/OnPlayingPlayer'

interface Props {
    album: FetchAlbum,
    cover: string
}
export const AlbumPage: React.FC<Props> = ({ album, cover}) => {
  const [song, setSong] = useState<Song>();

  // Handle scroll Effect
  const [dominantColorStop, setDominantColorStop] = useState(5);
  const [substituteColorStop, setSubstituteColorStop] = useState(46);
  const [coverHeight, setCoverHeight] = useState('30vh'); // Initial height
  const [coverWidth, setCoverWidth] = useState('30vh');   // Initial width
  const [coverOpacity, setCoverOpacity] = useState(1) // Set the initial values

  const albumContainerRef = useRef<HTMLDivElement | null>(null);

  const handleAlbumScroll = () => {
    if (albumContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = albumContainerRef.current;
      const scrollPercentage = (scrollTop / (clientHeight)) * 100;

      // Calculate new stop values for both colors
      const newDominantColorStop = 5 - scrollPercentage * 0.75;
      const newSubstituteColorStop = 46 - scrollPercentage * 0.75;

      // Calculate new height, width, and opacity based on scroll position
      const newHeight = `${30 - scrollPercentage * 0.5}vh`; // Adjust the rate as needed
      const newWidth = `${30 - scrollPercentage * 0.5}vh`;  // Adjust the rate as needed
      const newOpacity = 1 - scrollPercentage * 0.04;        // Adjust the rate as needed

      setDominantColorStop(newDominantColorStop);
      setSubstituteColorStop(newSubstituteColorStop);
      setCoverHeight(newHeight);
      setCoverWidth(newWidth);
      setCoverOpacity(newOpacity);
    }
  };

  useEffect(() => {
    if (albumContainerRef.current) {
      albumContainerRef.current.addEventListener('scroll', handleAlbumScroll);
    }

    return () => {
      if (albumContainerRef.current) {
        albumContainerRef.current.removeEventListener('scroll', handleAlbumScroll);
      }
    };
  }, []);

  
  return (
    <div className={styles.album}>
      <div 
        className={styles.albumBackground} 
        style={{
          background: (dominantColorStop <= -35) ? `${album.dominantColor}` : `linear-gradient(180deg, ${album.dominantColor} ${dominantColorStop}vh, rgba(35, 35, 35, 1) ${substituteColorStop}vh)`,
          height: (dominantColorStop <= -35) ? `6vh` : '100%'
        }}>
        {
          (dominantColorStop <= -35) && <h1>{album.title}</h1>
        }
        <div className={styles.albumCover} style={{ height: coverHeight, width: coverWidth, opacity: coverOpacity }}> 
          <img src={cover} alt={`${album.title} - ${album.artists}`}></img>
        </div>
      </div>
      <div className={styles.albumForground}>
        <div className={styles.albumContainer} ref={albumContainerRef}>
          <div className={styles.albumInfo}>
            <h1>{album.title}</h1>
            <h2>{album.artists}</h2>
            <h3>Album • {album.year}</h3>
          </div>
          <div className={styles.playerFunction}>
            <div 
              className={styles.playButton} 
              style={{
                position: (dominantColorStop <= -35) ? 'fixed' : 'unset',
                top: (dominantColorStop <= -35) ? '3vh' : '',
                right: (dominantColorStop <= -35) ? '0' : '',
                transform: (dominantColorStop <= -35) ? 'translateX(-2vh)' : ''
                }}>
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M18.7 8.97989L4.14 17.7099C4.05 17.3799 4 17.0299 4 16.6699V7.32989C4 4.24989 7.33 2.32989 10 3.86989L14.04 6.19989L18.09 8.53989C18.31 8.66989 18.52 8.80989 18.7 8.97989Z" fill="var(--on-background)"></path> <path opacity="0.4" d="M18.0907 15.4598L14.0407 17.7998L10.0007 20.1298C8.0907 21.2298 5.8407 20.5698 4.7207 18.9598L5.1407 18.7098L19.5807 10.0498C20.5807 11.8498 20.0907 14.3098 18.0907 15.4598Z" fill="var(--on-background)"></path> </g></svg>
            </div>
            <Shuffle/>
            <div className={styles.button}>
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M12 5.50063L11.4596 6.02073C11.463 6.02421 11.4664 6.02765 11.4698 6.03106L12 5.50063ZM8.96173 18.9109L8.49742 19.4999L8.96173 18.9109ZM15.0383 18.9109L14.574 18.3219L15.0383 18.9109ZM7.00061 16.4209C6.68078 16.1577 6.20813 16.2036 5.94491 16.5234C5.68169 16.8432 5.72758 17.3159 6.04741 17.5791L7.00061 16.4209ZM2.34199 13.4115C2.54074 13.7749 2.99647 13.9084 3.35988 13.7096C3.7233 13.5108 3.85677 13.0551 3.65801 12.6917L2.34199 13.4115ZM13.4698 8.03034C13.7627 8.32318 14.2376 8.32309 14.5304 8.03014C14.8233 7.7372 14.8232 7.26232 14.5302 6.96948L13.4698 8.03034ZM2.75 9.1371C2.75 6.98623 3.96537 5.18252 5.62436 4.42419C7.23607 3.68748 9.40166 3.88258 11.4596 6.02073L12.5404 4.98053C10.0985 2.44352 7.26409 2.02539 5.00076 3.05996C2.78471 4.07292 1.25 6.42503 1.25 9.1371H2.75ZM8.49742 19.4999C9.00965 19.9037 9.55955 20.3343 10.1168 20.6599C10.6739 20.9854 11.3096 21.25 12 21.25V19.75C11.6904 19.75 11.3261 19.6293 10.8736 19.3648C10.4213 19.1005 9.95208 18.7366 9.42605 18.3219L8.49742 19.4999ZM15.5026 19.4999C16.9292 18.3752 18.7528 17.0866 20.1833 15.4758C21.6395 13.8361 22.75 11.8026 22.75 9.1371H21.25C21.25 11.3345 20.3508 13.0282 19.0617 14.4798C17.7469 15.9603 16.0896 17.1271 14.574 18.3219L15.5026 19.4999ZM22.75 9.1371C22.75 6.42503 21.2153 4.07292 18.9992 3.05996C16.7359 2.02539 13.9015 2.44352 11.4596 4.98053L12.5404 6.02073C14.5983 3.88258 16.7639 3.68748 18.3756 4.42419C20.0346 5.18252 21.25 6.98623 21.25 9.1371H22.75ZM14.574 18.3219C14.0479 18.7366 13.5787 19.1005 13.1264 19.3648C12.6739 19.6293 12.3096 19.75 12 19.75V21.25C12.6904 21.25 13.3261 20.9854 13.8832 20.6599C14.4405 20.3343 14.9903 19.9037 15.5026 19.4999L14.574 18.3219ZM9.42605 18.3219C8.63014 17.6945 7.82129 17.0963 7.00061 16.4209L6.04741 17.5791C6.87768 18.2624 7.75472 18.9144 8.49742 19.4999L9.42605 18.3219ZM3.65801 12.6917C3.0968 11.6656 2.75 10.5033 2.75 9.1371H1.25C1.25 10.7746 1.66995 12.1827 2.34199 13.4115L3.65801 12.6917ZM11.4698 6.03106L13.4698 8.03034L14.5302 6.96948L12.5302 4.97021L11.4698 6.03106Z" fill="var(--on-background)"></path> </g></svg>
            </div>
          </div>
          <ul className={styles.songList}>
            {
              album.songs.map((song: any, ind) => {
                return(
                  <li key={ind} className={styles.song} onClick={() => setSong(song)}>
                    <div style={{display: 'flex'}}>
                      <span className={styles.trackNumber}>{ind + 1}</span>
                      <svg className={styles.icon} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M18.7 8.97989L4.14 17.7099C4.05 17.3799 4 17.0299 4 16.6699V7.32989C4 4.24989 7.33 2.32989 10 3.86989L14.04 6.19989L18.09 8.53989C18.31 8.66989 18.52 8.80989 18.7 8.97989Z" fill="var(--on-background)"></path> <path opacity="0.4" d="M18.0907 15.4598L14.0407 17.7998L10.0007 20.1298C8.0907 21.2298 5.8407 20.5698 4.7207 18.9598L5.1407 18.7098L19.5807 10.0498C20.5807 11.8498 20.0907 14.3098 18.0907 15.4598Z" fill="var(--on-background)"></path> </g></svg>
                    </div>
                    <div>
                      <h3>{song.title}</h3>
                      <h4>{song.artists.join(' • ')}</h4>
                    </div>
                  </li>
                )
              })
            }
          </ul>
        </div>
      </div>
      <OnPlayingPlayer song={song} color={album.dominantColor}/>
    </div>
  )
}
