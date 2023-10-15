import { DraftAlbum } from '@/types/Album.type'
import React from 'react'
import styles from './AlbumThumbnail.module.css'

interface Props {
    data: DraftAlbum
}
export const AlbumThumbnail: React.FC<Props> = ({data}) => {
  return (
    <div className={styles.albumThumbnail}>
        <div className={styles.albumCover}>
            <button className={styles.fullScreen}>
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path opacity="0.5" d="M12.9999 21.9994C17.055 21.9921 19.1784 21.8926 20.5354 20.5355C21.9999 19.0711 21.9999 16.714 21.9999 12C21.9999 7.28595 21.9999 4.92893 20.5354 3.46447C19.071 2 16.714 2 11.9999 2C7.28587 2 4.92884 2 3.46438 3.46447C2.10734 4.8215 2.00779 6.94493 2.00049 11" stroke="var(--on-background)" strokeWidth="1.5" strokeLinecap="round"></path> <path d="M12 12L17 7M17 7H13.25M17 7V10.75" stroke="var(--on-background)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path> <path d="M2 18C2 16.1144 2 15.1716 2.58579 14.5858C3.17157 14 4.11438 14 6 14C7.88562 14 8.82843 14 9.41421 14.5858C10 15.1716 10 16.1144 10 18C10 19.8856 10 20.8284 9.41421 21.4142C8.82843 22 7.88562 22 6 22C4.11438 22 3.17157 22 2.58579 21.4142C2 20.8284 2 19.8856 2 18Z" stroke="var(--on-background)" strokeWidth="1.5"></path> </g></svg>
            </button>
            <img className={styles.vinylImage} src='/assets/props/black vinyl.png'/>
            <img src={data.coverUrl} alt={data.title}/>
        </div>
        <div className={styles.albumInfo}>
            <h2>{data.title}</h2>
            <h3>{data.artists}</h3>
        </div>
    </div>
  )
}
