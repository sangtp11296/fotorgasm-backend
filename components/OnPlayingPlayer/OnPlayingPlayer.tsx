'use client'
import React, { useEffect, useRef, useState } from 'react'
import styles from './OnPlayingPlayer.module.css'
import { Song } from '@/types/Album.type'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { togglePlay, toggleRepeat, toggleShuffle, updateCurrentSong, updateNextSong, updatePrevSong } from '@/redux/playlist/playlist.slice'
import { NextIcon, PauseIcon, PlayIcon, PrevIcon, RepeatIcon, RepeatOneIcon, ShuffleIcon } from '../ButtonIcon/StaticIcons'

type Props = {
    // song: Song | undefined,
    color: string
}
export const OnPlayingPlayer: React.FC<Props> = ({ color }) => {
    const playlist = useAppSelector((state) => state.playlist);
    const dispatch = useAppDispatch();
    const audioRef = useRef<HTMLAudioElement>(null);
    const [songUrl, setSongUrl] = useState(null);
    const handleGetSong = async (srcKey: string) => {
        const res = await fetch('https://4esg1vvhi3.execute-api.ap-southeast-1.amazonaws.com/dev/get-file', {
            method: "POST",
            body: JSON.stringify({
                key: srcKey
            })
        });
        const resData = await res.json();
        const presignedUrl = resData.presignedUrl;
        setSongUrl(presignedUrl);
    }
    useEffect(() => {
        if(playlist.current){
            handleGetSong(playlist.current.srcKey);
        }
        if(playlist.playlist.length > 0) {
            const indexOfCurrentSong = playlist.playlist.findIndex(song => song === playlist.current);
            dispatch(updatePrevSong(playlist.playlist[indexOfCurrentSong - 1]));
            dispatch(updateNextSong(playlist.playlist[indexOfCurrentSong + 1]));
            if ( (indexOfCurrentSong + 1 === playlist.playlist.length) && playlist.repeat === 'all'){
                dispatch(updateNextSong(playlist.playlist[0]))
            }
        }
    }, [playlist.current]) 
    useEffect(() => {
        if(songUrl && audioRef.current){
            audioRef.current.play();
            dispatch(togglePlay(true));
        }
    }, [songUrl])

    // Handle Repeat
    const handleRepeat = () => {
        if (playlist.repeat === 'off') {
            dispatch(toggleRepeat('all'));
        } else if (playlist.repeat === 'all') {
            dispatch(toggleRepeat('one'));
        } else {
            dispatch(toggleRepeat('off'));
        }
    }
    useEffect(() => {
        if(playlist.playlist.length > 0) {
            const indexOfCurrentSong = playlist.playlist.findIndex(song => song === playlist.current);
            if ( (indexOfCurrentSong + 1 === playlist.playlist.length) && playlist.repeat === 'all'){
                dispatch(updateNextSong(playlist.playlist[0]))
            }
        }
    }, [playlist.repeat])
    // Handle Play Pause
    useEffect(() => {
        if(audioRef.current){
            if(playlist.isPlay){
                audioRef.current.play();
            } else {
                audioRef.current.pause();
            }
        }
    }, [playlist.isPlay])

    // Handle Progress Song
    const [progress, setProgress] = useState<number>(0);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    useEffect(() => {
        const trackingPosition = (currentTime / duration) * 100
        setProgress(trackingPosition)
    }, [currentTime]) 
    useEffect(() => {
        const audioElement = audioRef.current;

        if (audioElement) {
            audioElement.addEventListener('loadedmetadata', () => {
                setDuration(audioElement.duration);
            });

            audioElement.addEventListener('timeupdate', () => {
                setCurrentTime(audioElement.currentTime);
            });
        }
        return () => {
            // Clean up the event listeners when the component unmounts.
            if (audioElement) {
                audioElement.removeEventListener('loadedmetadata', () => {});
                audioElement.removeEventListener('timeupdate', () => {});
            }
        }
    }, [audioRef.current])
    // Handle Next vs Prev song
    useEffect(() => {
        if(progress === 100){
            dispatch(updateCurrentSong(playlist.next));
        }
    }, [progress])
  return (
    <div className={styles.onPlayingPlayer} style={{background: (Object.keys(playlist.current).length > 0) ? color: 'var(--surface-16)'}}>
        <div className={styles.upperField}>
            <div className={`${styles.songCover} ${!(Object.keys(playlist.current).length > 0) ? styles.unactive : styles.active}`} >
                {
                    Object.keys(playlist.current).length > 0 ? 
                    <img src={playlist.current?.thumbnail} alt={playlist.current?.title}/>
                    :
                    <svg height='3vh' width='3vh' viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M12 18C12 20.2091 10.2091 22 8 22C5.79086 22 4 20.2091 4 18C4 15.7909 5.79086 14 8 14C10.2091 14 12 15.7909 12 18Z" stroke="var(--on-background)" strokeWidth="1.5"></path> <path opacity="0.5" d="M12 18V8" stroke="var(--on-background)" strokeWidth="1.5"></path> <path d="M16.1167 3.94199L13.4833 5.25871C13.1184 5.44117 12.9359 5.5324 12.7852 5.64761C12.3949 5.94608 12.128 6.3778 12.0357 6.86043C12 7.04673 12 7.25073 12 7.65871C12 8.6298 12 9.11535 12.1196 9.44543C12.4356 10.3178 13.3101 10.8583 14.2317 10.7508C14.5804 10.7101 15.0147 10.493 15.8833 10.0587L18.5167 8.74199C18.8816 8.55954 19.0641 8.46831 19.2148 8.35309C19.6051 8.05463 19.872 7.62291 19.9643 7.14028C20 6.95397 20 6.74998 20 6.34199C20 5.3709 20 4.88536 19.8804 4.55528C19.5644 3.68288 18.6899 3.14239 17.7683 3.24989C17.4196 3.29057 16.9853 3.50771 16.1167 3.94199Z" stroke="var(--on-background)" strokeWidth="1.5" strokeLinecap="round"></path> </g></svg>
                }
            </div>
            <div className={styles.songInfo}>
                <h3>{playlist.current?.title}</h3>
                <h4>{playlist.current?.artists}</h4>
            </div>
            <div className={styles.playerFunction}>
                <button className={`${styles.repeatBtn} ${playlist.repeat !== 'off' && styles.active}`} onClick={handleRepeat}>
                    {
                        playlist.repeat === 'one' && <RepeatOneIcon color="var(--on-background)"/>
                    }
                    {
                        playlist.repeat === 'all' && <RepeatIcon color="var(--on-background)"/>
                    }
                    {
                        playlist.repeat === 'off' && <RepeatIcon color="var(--on-background-matte)"/>
                    }
                </button>
                <button className={`${styles.shuffleBtn} ${playlist.shuffle && styles.active}`} onClick={() => dispatch(toggleShuffle(!playlist.shuffle))}>
                    <ShuffleIcon color={playlist.shuffle ? 'var(--on-background)' : 'var(--on-background-matte)'}/>
                </button>
                {/* Prev button */}
                <button className={`${styles.prevBtn}`} disabled={!playlist.prev} onClick={() => dispatch(updateCurrentSong(playlist.prev))}>
                    <PrevIcon color="var(--on-background)"/>
                </button>
                <button disabled={playlist.playlist.length === 0} className={`${styles.playBtn} ${playlist.isPlay && styles.unactive}`} onClick={() => dispatch(togglePlay(!playlist.isPlay))}>
                    {
                        !playlist.isPlay ? 
                        <PlayIcon color='var(--on-background)'/>
                        :
                        <PauseIcon color='var(--on-background)'/>
                    }
                </button>
                {/* Next button */}
                <button className={`${styles.nextBtn}`} disabled={!playlist.next} onClick={() => dispatch(updateCurrentSong(playlist.next))}>
                    <NextIcon color='var(--on-background)'/>
                </button>

            </div>
        </div>
        <div className={styles.audioField}>
            {
                songUrl && <audio src={songUrl} ref={audioRef} loop={playlist.repeat === 'one'}/>
            }
            <div className={styles.progressBar}>
                <div className={styles.trackingLine} style={{ width: `${progress}%` }}></div>
            </div>
        </div>
    </div>
  )
}
