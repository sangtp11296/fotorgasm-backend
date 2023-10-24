'use client'
import React, { useEffect, useRef, useState } from 'react'
import styles from './OnPlayingPlayer.module.css'
import { Song } from '@/types/Album.type'

type Props = {
    song: Song | undefined,
    color: string
}
export const OnPlayingPlayer: React.FC<Props> = ({ song, color }) => {
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
        if(song){
            handleGetSong(song?.srcKey);
        }
    }, [song]) 

    // Handle Repeat
    const [repeat, setRepeat] = useState('off');
    const handleRepeat = () => {
        if (repeat === 'off') {
            setRepeat('all');
        } else if (repeat === 'all') {
            setRepeat('one');
        } else {
            setRepeat('off');
        }
    }
    // Handle Shuffle
    const [shuffle, setShuffle] = useState(false);
    // Handle Play Pause
    useEffect(() => {
        if(audioRef.current){
            audioRef.current.play();
            setPlay(true);
        }
    }, [songUrl])
    const [play, setPlay] = useState(false);
    const handlePlayPause = () => {
        if(audioRef.current){
            if (play) {
                setPlay(false);
                audioRef.current.pause();
            } else {
                setPlay(true);
                audioRef.current.play();
            }
        }
    }
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
  return (
    <div className={styles.onPlayingPlayer} style={{background: song ? color: 'var(--surface-16)'}}>
        <div className={styles.upperField}>
            <div className={`${styles.songCover} ${!song ? styles.unactive : styles.active}`} >
                {
                    song ? 
                    <img src={song?.thumbnail} alt={song?.title}/>
                    :
                    <svg height='3vh' width='3vh' viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M12 18C12 20.2091 10.2091 22 8 22C5.79086 22 4 20.2091 4 18C4 15.7909 5.79086 14 8 14C10.2091 14 12 15.7909 12 18Z" stroke="var(--on-background)" strokeWidth="1.5"></path> <path opacity="0.5" d="M12 18V8" stroke="var(--on-background)" strokeWidth="1.5"></path> <path d="M16.1167 3.94199L13.4833 5.25871C13.1184 5.44117 12.9359 5.5324 12.7852 5.64761C12.3949 5.94608 12.128 6.3778 12.0357 6.86043C12 7.04673 12 7.25073 12 7.65871C12 8.6298 12 9.11535 12.1196 9.44543C12.4356 10.3178 13.3101 10.8583 14.2317 10.7508C14.5804 10.7101 15.0147 10.493 15.8833 10.0587L18.5167 8.74199C18.8816 8.55954 19.0641 8.46831 19.2148 8.35309C19.6051 8.05463 19.872 7.62291 19.9643 7.14028C20 6.95397 20 6.74998 20 6.34199C20 5.3709 20 4.88536 19.8804 4.55528C19.5644 3.68288 18.6899 3.14239 17.7683 3.24989C17.4196 3.29057 16.9853 3.50771 16.1167 3.94199Z" stroke="var(--on-background)" strokeWidth="1.5" strokeLinecap="round"></path> </g></svg>
                }
            </div>
            <div className={styles.songInfo}>
                <h3>{song?.title}</h3>
                <h4>{song?.artists}</h4>
            </div>
            <div className={styles.playerFunction}>
                <button className={`${styles.repeatBtn} ${repeat !== 'off' && styles.active}`} onClick={handleRepeat}>
                    {
                        repeat === 'one' && <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M9.5 19.75C9.91421 19.75 10.25 19.4142 10.25 19C10.25 18.5858 9.91421 18.25 9.5 18.25V19.75ZM11 5V5.75C11.3033 5.75 11.5768 5.56727 11.6929 5.28701C11.809 5.00676 11.7448 4.68417 11.5303 4.46967L11 5ZM9.53033 2.46967C9.23744 2.17678 8.76256 2.17678 8.46967 2.46967C8.17678 2.76256 8.17678 3.23744 8.46967 3.53033L9.53033 2.46967ZM9.5 18.25H9.00028V19.75H9.5V18.25ZM9 5.75H11V4.25H9V5.75ZM11.5303 4.46967L9.53033 2.46967L8.46967 3.53033L10.4697 5.53033L11.5303 4.46967ZM1.25 12C1.25 16.2802 4.72011 19.75 9.00028 19.75V18.25C5.54846 18.25 2.75 15.4517 2.75 12H1.25ZM2.75 12C2.75 8.54822 5.54822 5.75 9 5.75V4.25C4.71979 4.25 1.25 7.71979 1.25 12H2.75Z" fill="var(--on-background)"></path> <path opacity="0.5" d="M13 19V18.25C12.6967 18.25 12.4232 18.4327 12.3071 18.713C12.191 18.9932 12.2552 19.3158 12.4697 19.5303L13 19ZM14.4697 21.5303C14.7626 21.8232 15.2374 21.8232 15.5303 21.5303C15.8232 21.2374 15.8232 20.7626 15.5303 20.4697L14.4697 21.5303ZM14.5 4.25C14.0858 4.25 13.75 4.58579 13.75 5C13.75 5.41421 14.0858 5.75 14.5 5.75V4.25ZM15 18.25H13V19.75H15V18.25ZM12.4697 19.5303L14.4697 21.5303L15.5303 20.4697L13.5303 18.4697L12.4697 19.5303ZM14.5 5.75H15V4.25H14.5V5.75ZM21.25 12C21.25 15.4518 18.4518 18.25 15 18.25V19.75C19.2802 19.75 22.75 16.2802 22.75 12H21.25ZM22.75 12C22.75 7.71979 19.2802 4.25 15 4.25V5.75C18.4518 5.75 21.25 8.54822 21.25 12H22.75Z" fill="var(--on-background)"></path> <path d="M10.5 11.5L12 10V14" stroke="var(--on-background)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path> </g></svg>
                    }
                    {
                        repeat === 'all' && <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M9.5 19.75C9.91421 19.75 10.25 19.4142 10.25 19C10.25 18.5858 9.91421 18.25 9.5 18.25V19.75ZM11 5V5.75C11.3033 5.75 11.5768 5.56727 11.6929 5.28701C11.809 5.00676 11.7448 4.68417 11.5303 4.46967L11 5ZM9.53033 2.46967C9.23744 2.17678 8.76256 2.17678 8.46967 2.46967C8.17678 2.76256 8.17678 3.23744 8.46967 3.53033L9.53033 2.46967ZM9.5 18.25H9.00028V19.75H9.5V18.25ZM9 5.75H11V4.25H9V5.75ZM11.5303 4.46967L9.53033 2.46967L8.46967 3.53033L10.4697 5.53033L11.5303 4.46967ZM1.25 12C1.25 16.2802 4.72011 19.75 9.00028 19.75V18.25C5.54846 18.25 2.75 15.4517 2.75 12H1.25ZM2.75 12C2.75 8.54822 5.54822 5.75 9 5.75V4.25C4.71979 4.25 1.25 7.71979 1.25 12H2.75Z" fill="var(--on-background)"></path> <path opacity="0.5" d="M13 19V18.25C12.6967 18.25 12.4232 18.4327 12.3071 18.713C12.191 18.9932 12.2552 19.3158 12.4697 19.5303L13 19ZM14.4697 21.5303C14.7626 21.8232 15.2374 21.8232 15.5303 21.5303C15.8232 21.2374 15.8232 20.7626 15.5303 20.4697L14.4697 21.5303ZM14.5 4.25C14.0858 4.25 13.75 4.58579 13.75 5C13.75 5.41421 14.0858 5.75 14.5 5.75V4.25ZM15 18.25H13V19.75H15V18.25ZM12.4697 19.5303L14.4697 21.5303L15.5303 20.4697L13.5303 18.4697L12.4697 19.5303ZM14.5 5.75H15V4.25H14.5V5.75ZM21.25 12C21.25 15.4518 18.4518 18.25 15 18.25V19.75C19.2802 19.75 22.75 16.2802 22.75 12H21.25ZM22.75 12C22.75 7.71979 19.2802 4.25 15 4.25V5.75C18.4518 5.75 21.25 8.54822 21.25 12H22.75Z" fill="var(--on-background)"></path> </g></svg>
                    }
                    {
                        repeat === 'off' && <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M9.5 19.75C9.91421 19.75 10.25 19.4142 10.25 19C10.25 18.5858 9.91421 18.25 9.5 18.25V19.75ZM11 5V5.75C11.3033 5.75 11.5768 5.56727 11.6929 5.28701C11.809 5.00676 11.7448 4.68417 11.5303 4.46967L11 5ZM9.53033 2.46967C9.23744 2.17678 8.76256 2.17678 8.46967 2.46967C8.17678 2.76256 8.17678 3.23744 8.46967 3.53033L9.53033 2.46967ZM9.5 18.25H9.00028V19.75H9.5V18.25ZM9 5.75H11V4.25H9V5.75ZM11.5303 4.46967L9.53033 2.46967L8.46967 3.53033L10.4697 5.53033L11.5303 4.46967ZM1.25 12C1.25 16.2802 4.72011 19.75 9.00028 19.75V18.25C5.54846 18.25 2.75 15.4517 2.75 12H1.25ZM2.75 12C2.75 8.54822 5.54822 5.75 9 5.75V4.25C4.71979 4.25 1.25 7.71979 1.25 12H2.75Z" fill="var(--on-background-matte)"></path> <path opacity="0.5" d="M13 19V18.25C12.6967 18.25 12.4232 18.4327 12.3071 18.713C12.191 18.9932 12.2552 19.3158 12.4697 19.5303L13 19ZM14.4697 21.5303C14.7626 21.8232 15.2374 21.8232 15.5303 21.5303C15.8232 21.2374 15.8232 20.7626 15.5303 20.4697L14.4697 21.5303ZM14.5 4.25C14.0858 4.25 13.75 4.58579 13.75 5C13.75 5.41421 14.0858 5.75 14.5 5.75V4.25ZM15 18.25H13V19.75H15V18.25ZM12.4697 19.5303L14.4697 21.5303L15.5303 20.4697L13.5303 18.4697L12.4697 19.5303ZM14.5 5.75H15V4.25H14.5V5.75ZM21.25 12C21.25 15.4518 18.4518 18.25 15 18.25V19.75C19.2802 19.75 22.75 16.2802 22.75 12H21.25ZM22.75 12C22.75 7.71979 19.2802 4.25 15 4.25V5.75C18.4518 5.75 21.25 8.54822 21.25 12H22.75Z" fill="var(--on-background-matte)"></path> </g></svg>
                    }
                </button>
                <button className={`${styles.shuffleBtn} ${shuffle && styles.active}`} onClick={() => setShuffle(!shuffle)}>
                    {
                        shuffle ? <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path opacity="0.4" d="M21.7507 17.9799C21.7507 17.9599 21.7407 17.9399 21.7407 17.9199C21.7307 17.8399 21.7207 17.7599 21.6907 17.6899C21.6507 17.5999 21.6007 17.5299 21.5407 17.4599C21.5407 17.4599 21.5407 17.4499 21.5307 17.4499C21.4607 17.3799 21.3807 17.3299 21.2907 17.2899C21.2007 17.2499 21.1007 17.2299 21.0007 17.2299L16.3307 17.2499C16.3307 17.2499 16.3307 17.2499 16.3207 17.2499C15.7207 17.2499 15.1407 16.9699 14.7807 16.4899L13.5607 14.9199C13.3107 14.5899 12.8407 14.5299 12.5107 14.7899C12.1807 15.0499 12.1207 15.5099 12.3807 15.8399L13.6007 17.4099C14.2507 18.2499 15.2707 18.7499 16.3307 18.7499H16.3407L19.1907 18.7399L18.4807 19.4499C18.1907 19.7399 18.1907 20.2199 18.4807 20.5099C18.6307 20.6599 18.8207 20.7299 19.0107 20.7299C19.2007 20.7299 19.3907 20.6599 19.5407 20.5099L21.5407 18.5099C21.6107 18.4399 21.6607 18.3599 21.7007 18.2699C21.7307 18.1699 21.7507 18.0699 21.7507 17.9799Z" fill="var(--on-background)"></path> <path opacity="0.4" d="M8.42026 6.68976C7.77026 5.78976 6.73024 5.25977 5.62024 5.25977C5.61024 5.25977 5.61025 5.25977 5.60025 5.25977L2.99023 5.26978C2.58023 5.26978 2.24023 5.60978 2.24023 6.01978C2.24023 6.42978 2.58023 6.76978 2.99023 6.76978L5.60025 6.75977H5.61023C6.24023 6.75977 6.83025 7.05976 7.19025 7.56976L8.27023 9.06976C8.42023 9.26976 8.65025 9.37976 8.88025 9.37976C9.03025 9.37976 9.19025 9.32975 9.32025 9.23975C9.66025 8.99975 9.73023 8.52976 9.49023 8.18976L8.42026 6.68976Z" fill="var(--on-background)"></path> <path d="M21.7402 6.07974C21.7402 6.05974 21.7502 6.03976 21.7502 6.02976C21.7502 5.92976 21.7302 5.82972 21.6902 5.73972C21.6502 5.64972 21.6002 5.56973 21.5302 5.49973L19.5302 3.49973C19.2402 3.20973 18.7602 3.20973 18.4702 3.49973C18.1802 3.78973 18.1802 4.26972 18.4702 4.55972L19.1802 5.26975L16.4503 5.25974C16.4403 5.25974 16.4402 5.25974 16.4302 5.25974C15.2802 5.25974 14.2002 5.82971 13.5602 6.79971L7.17026 16.3797C6.81026 16.9197 6.20023 17.2497 5.55023 17.2497H5.54025L2.99023 17.2397C2.58023 17.2397 2.24023 17.5697 2.24023 17.9897C2.24023 18.3997 2.57023 18.7397 2.99023 18.7397L5.54025 18.7497C5.55025 18.7497 5.55024 18.7497 5.56024 18.7497C6.72024 18.7497 7.79024 18.1797 8.43024 17.2097L14.8203 7.62973C15.1803 7.08973 15.7902 6.75974 16.4402 6.75974H16.4503L21.0002 6.77976C21.1002 6.77976 21.1903 6.7597 21.2903 6.7197C21.3803 6.6797 21.4602 6.62972 21.5302 6.55972C21.5302 6.55972 21.5303 6.54971 21.5403 6.54971C21.6003 6.47971 21.6602 6.40973 21.6902 6.31973C21.7202 6.23973 21.7302 6.15974 21.7402 6.07974Z" fill="var(--on-background)"></path> </g></svg>
                        :
                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path opacity="0.4" d="M21.7507 17.9799C21.7507 17.9599 21.7407 17.9399 21.7407 17.9199C21.7307 17.8399 21.7207 17.7599 21.6907 17.6899C21.6507 17.5999 21.6007 17.5299 21.5407 17.4599C21.5407 17.4599 21.5407 17.4499 21.5307 17.4499C21.4607 17.3799 21.3807 17.3299 21.2907 17.2899C21.2007 17.2499 21.1007 17.2299 21.0007 17.2299L16.3307 17.2499C16.3307 17.2499 16.3307 17.2499 16.3207 17.2499C15.7207 17.2499 15.1407 16.9699 14.7807 16.4899L13.5607 14.9199C13.3107 14.5899 12.8407 14.5299 12.5107 14.7899C12.1807 15.0499 12.1207 15.5099 12.3807 15.8399L13.6007 17.4099C14.2507 18.2499 15.2707 18.7499 16.3307 18.7499H16.3407L19.1907 18.7399L18.4807 19.4499C18.1907 19.7399 18.1907 20.2199 18.4807 20.5099C18.6307 20.6599 18.8207 20.7299 19.0107 20.7299C19.2007 20.7299 19.3907 20.6599 19.5407 20.5099L21.5407 18.5099C21.6107 18.4399 21.6607 18.3599 21.7007 18.2699C21.7307 18.1699 21.7507 18.0699 21.7507 17.9799Z" fill="var(--on-background-matte)"></path> <path opacity="0.4" d="M8.42026 6.68976C7.77026 5.78976 6.73024 5.25977 5.62024 5.25977C5.61024 5.25977 5.61025 5.25977 5.60025 5.25977L2.99023 5.26978C2.58023 5.26978 2.24023 5.60978 2.24023 6.01978C2.24023 6.42978 2.58023 6.76978 2.99023 6.76978L5.60025 6.75977H5.61023C6.24023 6.75977 6.83025 7.05976 7.19025 7.56976L8.27023 9.06976C8.42023 9.26976 8.65025 9.37976 8.88025 9.37976C9.03025 9.37976 9.19025 9.32975 9.32025 9.23975C9.66025 8.99975 9.73023 8.52976 9.49023 8.18976L8.42026 6.68976Z" fill="var(--on-background-matte)"></path> <path d="M21.7402 6.07974C21.7402 6.05974 21.7502 6.03976 21.7502 6.02976C21.7502 5.92976 21.7302 5.82972 21.6902 5.73972C21.6502 5.64972 21.6002 5.56973 21.5302 5.49973L19.5302 3.49973C19.2402 3.20973 18.7602 3.20973 18.4702 3.49973C18.1802 3.78973 18.1802 4.26972 18.4702 4.55972L19.1802 5.26975L16.4503 5.25974C16.4403 5.25974 16.4402 5.25974 16.4302 5.25974C15.2802 5.25974 14.2002 5.82971 13.5602 6.79971L7.17026 16.3797C6.81026 16.9197 6.20023 17.2497 5.55023 17.2497H5.54025L2.99023 17.2397C2.58023 17.2397 2.24023 17.5697 2.24023 17.9897C2.24023 18.3997 2.57023 18.7397 2.99023 18.7397L5.54025 18.7497C5.55025 18.7497 5.55024 18.7497 5.56024 18.7497C6.72024 18.7497 7.79024 18.1797 8.43024 17.2097L14.8203 7.62973C15.1803 7.08973 15.7902 6.75974 16.4402 6.75974H16.4503L21.0002 6.77976C21.1002 6.77976 21.1903 6.7597 21.2903 6.7197C21.3803 6.6797 21.4602 6.62972 21.5302 6.55972C21.5302 6.55972 21.5303 6.54971 21.5403 6.54971C21.6003 6.47971 21.6602 6.40973 21.6902 6.31973C21.7202 6.23973 21.7302 6.15974 21.7402 6.07974Z" fill="var(--on-background-matte)"></path> </g></svg>
                    }
                    
                </button>
                <button className={`${styles.playBtn} ${play && styles.unactive}`} onClick={handlePlayPause}>
                    {
                        !play ? 
                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M18.7 8.97989L4.14 17.7099C4.05 17.3799 4 17.0299 4 16.6699V7.32989C4 4.24989 7.33 2.32989 10 3.86989L14.04 6.19989L18.09 8.53989C18.31 8.66989 18.52 8.80989 18.7 8.97989Z" fill="var(--on-background)"></path> <path opacity="0.4" d="M18.0907 15.4598L14.0407 17.7998L10.0007 20.1298C8.0907 21.2298 5.8407 20.5698 4.7207 18.9598L5.1407 18.7098L19.5807 10.0498C20.5807 11.8498 20.0907 14.3098 18.0907 15.4598Z" fill="var(--on-background)"></path> </g></svg> 
                        :
                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M2 6C2 4.11438 2 3.17157 2.58579 2.58579C3.17157 2 4.11438 2 6 2C7.88562 2 8.82843 2 9.41421 2.58579C10 3.17157 10 4.11438 10 6V18C10 19.8856 10 20.8284 9.41421 21.4142C8.82843 22 7.88562 22 6 22C4.11438 22 3.17157 22 2.58579 21.4142C2 20.8284 2 19.8856 2 18V6Z" fill="var(--on-background)"></path> <path opacity="0.5" d="M14 6C14 4.11438 14 3.17157 14.5858 2.58579C15.1716 2 16.1144 2 18 2C19.8856 2 20.8284 2 21.4142 2.58579C22 3.17157 22 4.11438 22 6V18C22 19.8856 22 20.8284 21.4142 21.4142C20.8284 22 19.8856 22 18 22C16.1144 22 15.1716 22 14.5858 21.4142C14 20.8284 14 19.8856 14 18V6Z" fill="var(--on-background)"></path> </g></svg>
                    }
                </button>
            </div>
        </div>
        <div className={styles.audioField}>
            {
                songUrl && <audio src={songUrl} ref={audioRef} loop={repeat === 'one'}/>
            }
            <div className={styles.progressBar}>
                <div className={styles.trackingLine} style={{ width: `${progress}%` }}></div>
            </div>
        </div>
    </div>
  )
}
