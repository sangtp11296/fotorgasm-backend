'use client'
import { getAlbums } from '@/utils/getMusic';
import React, { useEffect, useState } from 'react'
import styles from './PostSum.module.css'
import { FetchAlbum } from '@/types/Album.type';
import { AuthorIcon, AwardIcon, HeartIcon, ListenIcon, YearReleaseIcon } from '@/components/ButtonIcon/StaticIcons';

interface Props {
  total: (totalAlbums: number) => void,
  chosen: (chosenAlbum: FetchAlbum) => void,
}
export const AlbumList: React.FC<Props> = ({ total, chosen }) => {
   // Handle get albums
   const [albums, setAlbums] = useState([]);
   const [page, setPage] = useState(1);
   const [totalAlbums, setTotalAlbums] = useState();
   const handleGetAlbums = async (page: number) => {
       const data = getAlbums(page, 5);
       setTotalAlbums((await data).totalAlbums)
       total((await data).totalAlbums);
       setAlbums((await data).albums);
   }
   useEffect(() => {
       handleGetAlbums(page);
   }, [page])
    // Handle active edit
   const [chosenAlbum, setChosenAlbum] = useState<FetchAlbum>();
   useEffect(() => {
    chosenAlbum && chosen(chosenAlbum);
   }, [chosenAlbum])
   // Handle active pagination
   const [activeBtn, setActiveBtn] = useState<number>(1)
   const handleActive = (page: number) => {
       setPage(page);
       setActiveBtn(page)
   }
  return (
    <>
      <table id='postList' className={styles.postList}>
          <thead>
              <tr className={styles.listLabel}>
              {/* Title */}
              <th className={styles.labelItem}>Title</th>
              {/* Artists */}
              <th className={`${styles.labelItem} ${styles.iconContainer}`}>
                  <AuthorIcon color='var(--on-background-matte)'/>
              </th>
              {/* Year */}
              <th className={`${styles.labelItem} ${styles.iconContainer}`}>
                <YearReleaseIcon color='var(--on-background-matte)'/>
              </th>
              {/* Listen */}
              <th className={`${styles.labelItem} ${styles.iconContainer}`}>
                <ListenIcon color='var(--on-background-matte)'/>
              </th>
              {/* Distinctions */}
              <th className={`${styles.labelItem} ${styles.iconContainer}`}>
                <AwardIcon color='var(--on-background-matte)'/>
              </th>
              {/* Like */}
              <th className={`${styles.labelItem} ${styles.iconContainer}`}>
                  <HeartIcon color='var(--on-background-matte)' />
              </th>
              
              </tr>
          </thead>
          <tbody>
              {
              albums.map((album: FetchAlbum, ind) => {
                  return(
                  <tr style={{backgroundColor: chosenAlbum?._id === album._id ? 'var(--surface-16)': ''}} key={ind} onClick={() => setChosenAlbum(album)}>
                      <td>{album.title}</td>
                      <td>{album.artists.map(artist => artist.name).join(', ')}</td>
                      <td>{album.year}</td>
                      <td>{album.views}</td>
                      <td>{album.distinctions}</td>
                      <td>{album.likes}</td>
                  </tr>
                  )
              })
              }

          </tbody>
      </table>
      <div className={styles.pagination}>
          {
            totalAlbums &&
            Array(Math.ceil(totalAlbums / 5)).fill(null).map((_, i) => (
              <button style={{backgroundColor: (activeBtn === i + 1) ? 'var(--on-background)' : 'var(--on-background-matte)'}} key={i} onClick={() => handleActive(i + 1)}></button>
            ))
          }
        </div>
    </>
  )
}
