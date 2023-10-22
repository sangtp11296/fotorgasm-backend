
import { FetchAlbum } from '@/types/Album.type'
import React from 'react'
import styles from './Album.module.css'

interface Props {
    album: FetchAlbum,
    cover: string
}
export const AlbumPage: React.FC<Props> = ({ album, cover}) => {
  return (
    <div className={styles.album}>
      <div className={styles.albumBackground}>
        <div className={styles.albumCover}> 
          <img src={cover}></img>
        </div>
      </div>
      <div className={styles.albumForground}>

      </div>
    </div>
  )
}
