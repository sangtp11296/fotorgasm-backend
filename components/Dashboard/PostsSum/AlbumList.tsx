'use client'
import { getAlbums } from '@/utils/getMusic';
import React, { useEffect, useState } from 'react'
import styles from './PostSum.module.css'
import { FetchAlbum } from '@/types/Album.type';

interface Props {
  total: (totalPosts: number) => void,
  // chosen: (chosenPost: FetchedPost) => void,
}
export const AlbumList: React.FC<Props> = ({ total }) => {
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
  //  const [chosenPost, setChosenPost] = useState<FetchedPost>()
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
              <th className={styles.labelItem}>
                  <svg height={20} width={20} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <circle cx="12" cy="9" r="3" stroke="var(--on-background-matte)" strokeWidth="2"></circle> <path d="M17.9691 20C17.81 17.1085 16.9247 15 11.9999 15C7.07521 15 6.18991 17.1085 6.03076 20" stroke="var(--on-background-matte)" strokeWidth="2" strokeLinecap="round"></path> <path d="M7 3.33782C8.47087 2.48697 10.1786 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 10.1786 2.48697 8.47087 3.33782 7" stroke="var(--on-background-matte)" strokeWidth="2" strokeLinecap="round"></path> </g></svg>
              </th>
              {/* Year */}
              <th className={styles.labelItem}>
                <svg height={20} width={20} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M2 12C2 8.22876 2 6.34315 3.17157 5.17157C4.34315 4 6.22876 4 10 4H14C17.7712 4 19.6569 4 20.8284 5.17157C22 6.34315 22 8.22876 22 12V14C22 17.7712 22 19.6569 20.8284 20.8284C19.6569 22 17.7712 22 14 22H10C6.22876 22 4.34315 22 3.17157 20.8284C2 19.6569 2 17.7712 2 14V12Z" stroke="var(--on-background-matte)" strokeWidth="1.5"></path> <path opacity="0.5" d="M7 4V2.5" stroke="var(--on-background-matte)" strokeWidth="2" strokeLinecap="round"></path> <path opacity="0.5" d="M17 4V2.5" stroke="var(--on-background-matte)" strokeWidth="2" strokeLinecap="round"></path> <path opacity="0.5" d="M2.5 9H21.5" stroke="var(--on-background-matte)" strokeWidth="2" strokeLinecap="round"></path> <path d="M18 17C18 17.5523 17.5523 18 17 18C16.4477 18 16 17.5523 16 17C16 16.4477 16.4477 16 17 16C17.5523 16 18 16.4477 18 17Z" fill="var(--on-background-matte)"></path> <path d="M18 13C18 13.5523 17.5523 14 17 14C16.4477 14 16 13.5523 16 13C16 12.4477 16.4477 12 17 12C17.5523 12 18 12.4477 18 13Z" fill="var(--on-background-matte)"></path> <path d="M13 17C13 17.5523 12.5523 18 12 18C11.4477 18 11 17.5523 11 17C11 16.4477 11.4477 16 12 16C12.5523 16 13 16.4477 13 17Z" fill="var(--on-background-matte)"></path> <path d="M13 13C13 13.5523 12.5523 14 12 14C11.4477 14 11 13.5523 11 13C11 12.4477 11.4477 12 12 12C12.5523 12 13 12.4477 13 13Z" fill="var(--on-background-matte)"></path> <path d="M8 17C8 17.5523 7.55228 18 7 18C6.44772 18 6 17.5523 6 17C6 16.4477 6.44772 16 7 16C7.55228 16 8 16.4477 8 17Z" fill="var(--on-background-matte)"></path> <path d="M8 13C8 13.5523 7.55228 14 7 14C6.44772 14 6 13.5523 6 13C6 12.4477 6.44772 12 7 12C7.55228 12 8 12.4477 8 13Z" fill="var(--on-background-matte)"></path> </g></svg> 
              </th>
              {/* Listen */}
              <th className={styles.labelItem}>
                <svg height={20} width={20} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M18 11.5V11.3C18 10.7477 18.4477 10.3 19 10.3C20.6569 10.3 22 8.95685 22 7.3V5.1875C22 5.0134 22 4.92635 21.9964 4.8528C21.9207 3.31169 20.6883 2.07932 19.1472 2.00361C19.0736 2 18.9866 2 18.8125 2C18.5223 2 18.3773 2 18.2547 2.00602C15.6861 2.13221 13.6322 4.18614 13.506 6.75466C13.5 6.87726 13.5 7.02234 13.5 7.3125V13.5" stroke="var(--on-background-matte)" strokeWidth="2" strokeLinecap="round"></path> <path d="M10.5 19V19.75C10.5 20.9926 9.49264 22 8.25 22C7.00736 22 6 20.9926 6 19.75V19M10.5 19V9.3125C10.5 9.02234 10.5 8.87726 10.494 8.75466C10.3678 6.18614 8.31386 4.13221 5.74534 4.00602C5.62274 4 5.47766 4 5.1875 4C5.0134 4 4.92635 4 4.8528 4.00361C3.31169 4.07932 2.07932 5.31169 2.00361 6.8528C2 6.92635 2 7.0134 2 7.1875V9.3C2 10.9569 3.34315 12.3 5 12.3C5.55228 12.3 6 12.7477 6 13.3V19M10.5 19H6" stroke="var(--on-background-matte)" strokeWidth="2"></path> <path opacity="0.5" d="M19.5 5V7.5" stroke="var(--on-background-matte)" strokeWidth="1.5" strokeLinecap="round"></path> <path opacity="0.5" d="M4.5 7V9.5" stroke="var(--on-background-matte)" strokeWidth="1.5" strokeLinecap="round"></path> <circle opacity="0.5" cx="18" cy="18" r="4" stroke="var(--on-background-matte)" strokeWidth="1.5"></circle> <path d="M18 16.5L17 18H19L18 19.5" stroke="var(--on-background-matte)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path> </g></svg>
              </th>
              {/* Distinctions */}
              <th className={styles.labelItem}>
                <svg height={20} width={20} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path opacity="0.5" d="M11.1459 7.02251C11.5259 6.34084 11.7159 6 12 6C12.2841 6 12.4741 6.34084 12.8541 7.02251L12.9524 7.19887C13.0603 7.39258 13.1143 7.48944 13.1985 7.55334C13.2827 7.61725 13.3875 7.64097 13.5972 7.68841L13.7881 7.73161C14.526 7.89857 14.895 7.98205 14.9828 8.26432C15.0706 8.54659 14.819 8.84072 14.316 9.42898L14.1858 9.58117C14.0429 9.74833 13.9714 9.83191 13.9392 9.93531C13.9071 10.0387 13.9179 10.1502 13.9395 10.3733L13.9592 10.5763C14.0352 11.3612 14.0733 11.7536 13.8435 11.9281C13.6136 12.1025 13.2682 11.9435 12.5773 11.6254L12.3986 11.5431C12.2022 11.4527 12.1041 11.4075 12 11.4075C11.8959 11.4075 11.7978 11.4527 11.6014 11.5431L11.4227 11.6254C10.7318 11.9435 10.3864 12.1025 10.1565 11.9281C9.92674 11.7536 9.96476 11.3612 10.0408 10.5763L10.0605 10.3733C10.0821 10.1502 10.0929 10.0387 10.0608 9.93531C10.0286 9.83191 9.95713 9.74833 9.81418 9.58117L9.68403 9.42898C9.18097 8.84072 8.92945 8.54659 9.01723 8.26432C9.10501 7.98205 9.47396 7.89857 10.2119 7.73161L10.4028 7.68841C10.6125 7.64097 10.7173 7.61725 10.8015 7.55334C10.8857 7.48944 10.9397 7.39258 11.0476 7.19887L11.1459 7.02251Z" stroke="var(--on-background-matte)" strokeWidth="2"></path> <path d="M19 9C19 12.866 15.866 16 12 16C8.13401 16 5 12.866 5 9C5 5.13401 8.13401 2 12 2C15.866 2 19 5.13401 19 9Z" stroke="var(--on-background-matte)" strokeWidth="2"></path> <path opacity="0.5" d="M12 16.0678L8.22855 19.9728C7.68843 20.5321 7.41837 20.8117 7.18967 20.9084C6.66852 21.1289 6.09042 20.9402 5.81628 20.4602C5.69597 20.2495 5.65848 19.8695 5.5835 19.1095C5.54117 18.6804 5.52 18.4658 5.45575 18.2861C5.31191 17.8838 5.00966 17.5708 4.6211 17.4219C4.44754 17.3554 4.24033 17.3335 3.82589 17.2896C3.09187 17.212 2.72486 17.1732 2.52138 17.0486C2.05772 16.7648 1.87548 16.1662 2.08843 15.6266C2.18188 15.3898 2.45194 15.1102 2.99206 14.5509L5.45575 12" stroke="var(--on-background-matte)" strokeWidth="2"></path> <path opacity="0.5" d="M12 16.0678L15.7715 19.9728C16.3116 20.5321 16.5816 20.8117 16.8103 20.9084C17.3315 21.1289 17.9096 20.9402 18.1837 20.4602C18.304 20.2495 18.3415 19.8695 18.4165 19.1095C18.4588 18.6804 18.48 18.4658 18.5442 18.2861C18.6881 17.8838 18.9903 17.5708 19.3789 17.4219C19.5525 17.3554 19.7597 17.3335 20.1741 17.2896C20.9081 17.212 21.2751 17.1732 21.4786 17.0486C21.9423 16.7648 22.1245 16.1662 21.9116 15.6266C21.8181 15.3898 21.5481 15.1102 21.0079 14.5509L18.5442 12" stroke="var(--on-background-matte)" strokeWidth="2"></path> </g></svg>
              </th>
              {/* Like */}
              <th className={styles.labelItem}>
                  <svg height={20} width={20} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="var(--on-background-matte)" strokeWidth="0.4"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M12 5.50063L11.4596 6.02073C11.463 6.02421 11.4664 6.02765 11.4698 6.03106L12 5.50063ZM8.96173 18.9109L8.49742 19.4999L8.96173 18.9109ZM15.0383 18.9109L14.574 18.3219L15.0383 18.9109ZM7.00061 16.4209C6.68078 16.1577 6.20813 16.2036 5.94491 16.5234C5.68169 16.8432 5.72758 17.3159 6.04741 17.5791L7.00061 16.4209ZM2.34199 13.4115C2.54074 13.7749 2.99647 13.9084 3.35988 13.7096C3.7233 13.5108 3.85677 13.0551 3.65801 12.6917L2.34199 13.4115ZM13.4698 8.03034C13.7627 8.32318 14.2376 8.32309 14.5304 8.03014C14.8233 7.7372 14.8232 7.26232 14.5302 6.96948L13.4698 8.03034ZM2.75 9.1371C2.75 6.98623 3.96537 5.18252 5.62436 4.42419C7.23607 3.68748 9.40166 3.88258 11.4596 6.02073L12.5404 4.98053C10.0985 2.44352 7.26409 2.02539 5.00076 3.05996C2.78471 4.07292 1.25 6.42503 1.25 9.1371H2.75ZM8.49742 19.4999C9.00965 19.9037 9.55955 20.3343 10.1168 20.6599C10.6739 20.9854 11.3096 21.25 12 21.25V19.75C11.6904 19.75 11.3261 19.6293 10.8736 19.3648C10.4213 19.1005 9.95208 18.7366 9.42605 18.3219L8.49742 19.4999ZM15.5026 19.4999C16.9292 18.3752 18.7528 17.0866 20.1833 15.4758C21.6395 13.8361 22.75 11.8026 22.75 9.1371H21.25C21.25 11.3345 20.3508 13.0282 19.0617 14.4798C17.7469 15.9603 16.0896 17.1271 14.574 18.3219L15.5026 19.4999ZM22.75 9.1371C22.75 6.42503 21.2153 4.07292 18.9992 3.05996C16.7359 2.02539 13.9015 2.44352 11.4596 4.98053L12.5404 6.02073C14.5983 3.88258 16.7639 3.68748 18.3756 4.42419C20.0346 5.18252 21.25 6.98623 21.25 9.1371H22.75ZM14.574 18.3219C14.0479 18.7366 13.5787 19.1005 13.1264 19.3648C12.6739 19.6293 12.3096 19.75 12 19.75V21.25C12.6904 21.25 13.3261 20.9854 13.8832 20.6599C14.4405 20.3343 14.9903 19.9037 15.5026 19.4999L14.574 18.3219ZM9.42605 18.3219C8.63014 17.6945 7.82129 17.0963 7.00061 16.4209L6.04741 17.5791C6.87768 18.2624 7.75472 18.9144 8.49742 19.4999L9.42605 18.3219ZM3.65801 12.6917C3.0968 11.6656 2.75 10.5033 2.75 9.1371H1.25C1.25 10.7746 1.66995 12.1827 2.34199 13.4115L3.65801 12.6917ZM11.4698 6.03106L13.4698 8.03034L14.5302 6.96948L12.5302 4.97021L11.4698 6.03106Z" fill="var(--on-background-matte)"></path> </g></svg>
              </th>
              
              </tr>
          </thead>
          <tbody>
              {
              albums.map((album: FetchAlbum, ind) => {
                  return(
                  <tr key={ind}>
                      <td>{album.title}</td>
                      <td>{album.artists}</td>
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
