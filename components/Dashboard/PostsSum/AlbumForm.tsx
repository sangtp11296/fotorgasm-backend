'use client'
import React, { useState } from 'react'
import styles from './PostSum.module.css'
import { albumArtists, albumComposers, albumDesc, albumDistinctions, albumFormat, albumGenres, albumSlug, albumTags, albumTitle, albumYear, clearAlbum } from '@/redux/post/album.slice'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { clearDraft, updateFormat } from '@/redux/post/draft.slice'
import { toSlug } from '@/utils/common/toSlug'
import { getArtistBio } from '@/utils/getArtistBio'
import { Artist } from '@/types/Album.type'

export const AlbumForm = () => {
    const draftAlbum = useAppSelector((state) => state.draftAlbum); 
    const dispatch = useAppDispatch();

    const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const inputText = e.target.value;
        
        if (timeoutId) {
          clearTimeout(timeoutId); // Clear the previous timeout
        }
    
        const newTimeoutId = setTimeout(() => {
          handleArtistBio(inputText.split(', '));
        }, 2000); // Wait for 2 seconds
    
        setTimeoutId(newTimeoutId);
      };
    const handleArtistBio = async (artists: string[]) => {
        const artistArray: Artist[] = []
        for (const artist of artists) {
            if (artist !== 'Various Artists') {
                try {
                    const artistBio = await getArtistBio(artist);
                    artistArray.push(artistBio)
                } catch (error) {
                    console.error('Error fetching artist bio:', error);
                }
            } else {
                dispatch(albumArtists([{
                    name: 'Various Artists',
                    bio: {
                        content: '',
                        summary: ''
                    },
                    avatar: ''
                }]));
                return
            }
        }
        dispatch(albumArtists(artistArray))
    };
    console.log(draftAlbum.artists)
  return (
    <>
        <div className={styles.textField}>
                <label>Post Format<span className={styles.textDanger}> *</span></label>
                <select name='post_format' defaultValue={draftAlbum.format} placeholder='Select Post Format...' className={styles.textInput}
                onChange={(e) => {
                if (e.target.value === 'album'){
                    dispatch(clearDraft())
                    dispatch(albumFormat(e.target.value))
                } else {
                    dispatch(clearAlbum())
                    dispatch(updateFormat(e.target.value))
                }}}>
                    <option value='none' defaultValue='none' className={styles.items}>Select Post Format...</option>
                    <option value='blog' className={styles.items}>blog</option>
                    <option value='photo' className={styles.items}>photo</option>
                    <option value='video' className={styles.items}>video</option>
                    <option value='album' className={styles.items}>album</option>
                </select>
            </div>
        <div className={styles.textField}>
            <label>Title of the Playlist<span className={styles.textDanger}> *</span></label>
            <input name='title' type='text' defaultValue={draftAlbum.title} required maxLength={500} className={styles.textInput} autoFocus={true} placeholder='Title...' onChange={(e) => {
            dispatch(albumTitle(e.target.value));
            dispatch(albumSlug(toSlug(e.target.value)));
            }}/>
        </div>
        <div className={styles.textField}>
            <label>Artists<span className={styles.textDanger}> *</span></label>
            <input name='artists' type='text' defaultValue={draftAlbum.artists.map(artist => artist.name).join(', ')} required maxLength={500} className={styles.textInput} autoFocus={true} placeholder='Artist...' onChange={handleInputChange}/>
        </div>
        <div className={styles.textField}>
            <label>Composers<span className={styles.textDanger}> *</span></label>
            <input name='composers' type='text' defaultValue={draftAlbum.composers} required maxLength={500} className={styles.textInput} autoFocus={true} placeholder='Composers...' onChange={(e) => {
            dispatch(albumComposers(e.target.value.split(', ')));
            }}/>
        </div>
        <div className={styles.textField}>
            <label>Genres<span className={styles.textDanger}> *</span></label>
            <input name='genres' type='text' defaultValue={draftAlbum.genres} required maxLength={500} className={styles.textInput} autoFocus={true} placeholder='Genres...' onChange={(e) => {
            dispatch(albumGenres(e.target.value.split(', ')));
            }}/>
        </div>
        <div className={styles.textField}>
            <label>Distinctions</label>
            <input name='distinctions' type='text' defaultValue={draftAlbum.distinctions} maxLength={500} className={styles.textInput} autoFocus={true} placeholder='Distinctions...' onChange={(e) => {
            dispatch(albumDistinctions(e.target.value.split(', ')));
            }}/>
        </div>
        <div className={styles.textField}>
            <label>Tags</label>
            <input defaultValue={draftAlbum.tags} name='tags' type='text' className={styles.textInput} onChange={(e) => dispatch(albumTags(e.target.value.split(', ')))}/>
        </div>
        <div className={styles.textField}>
            <label>Year of Composition<span className={styles.textDanger}> *</span></label>
            <input defaultValue={draftAlbum.year} name='year' type='text' required className={styles.textInput} onChange={(e) => dispatch(albumYear(parseInt(e.target.value)))}/>
        </div>
        <div className={styles.textField}>
        <label>Description</label>
        <textarea defaultValue={draftAlbum.desc} name='description' style={{maxHeight:'65px', maxWidth:'250px',minWidth:'250px', minHeight:'28px'}} className={styles.textInput} placeholder='Description' onChange={(e) => dispatch(albumDesc(e.target.value))}></textarea>
        </div>
    </>
  )
}
