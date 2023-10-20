'use client'
import React, { useEffect, useState } from 'react'
import styles from './PostSum.module.css'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { clearDraft, updateAuthor, updateCat, updateDesc, updateFormat, updateSlug, updateTag, updateTitle } from '@/redux/post/draft.slice'
import { Teammate } from '@/types/User.type'
import { useSession } from 'next-auth/react'
import { getTeams } from '@/utils/getTeam'
import { albumFormat, clearAlbum } from '@/redux/post/album.slice'
import { toSlug } from '@/utils/common/toSlug'

export const PostForm = () => {
    const draft = useAppSelector((state) => state.draft);
    const dispatch = useAppDispatch();
    const session = useSession();
    const user = session.data?.user;
    // Fetch team members
    const [members, setMembers] = useState<Teammate[]>([]);
    const handleGetTeamMembers = async () => {
        if (user?.team){
            const members = getTeams(user.team);
            setMembers((await members).teamMembers);
        }
    }
    useEffect(() => {
        handleGetTeamMembers();
    },[])
  return (
    <>
        <div className={styles.textField}>
            <label>Post Format<span className={styles.textDanger}> *</span></label>
            <select name='post_format' defaultValue={draft.format} placeholder='Select Post Format...' className={styles.textInput}
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
            <label>Title of the Post<span className={styles.textDanger}> *</span></label>
            <input name='title' type='text' defaultValue={draft.title} required maxLength={500} className={styles.textInput} autoFocus={true} placeholder='Title' onChange={(e) => {
            dispatch(updateTitle(e.target.value));
            dispatch(updateSlug(toSlug(e.target.value)));
            }}/>
        </div>
        <div className={styles.textField}>
            <label>Author<span className={styles.textDanger}> *</span></label>
            <select name='author' defaultValue={draft.author} placeholder='Author...' className={styles.textInput}  onChange={(e) => dispatch(updateAuthor(e.target.value))}>
            <option value='' defaultValue='' className={styles.items}>Author...</option>
            {
                members.map((mem, ind) => {
                return <option key={ind} value={mem.name} className={styles.items}>{mem.name}</option>
                })
            }
            </select>
        </div>
        <div className={styles.textField}>
            <label>Category<span className={styles.textDanger}> *</span></label>
            <select defaultValue={draft.category} name='category' placeholder='Select category...' className={styles.textInput}  onChange={(e) => dispatch(updateCat(e.target.value))}>
                <option value='' defaultValue='' className={styles.items}>Select section...</option>
                <option value='Fotography' className={styles.items}>Fotography</option>
                <option value='Films' className={styles.items}>Films</option>
                <option value='Something' className={styles.items}>Something</option>
                <option value='Vinyls' className={styles.items}>Vinyls</option>
                <option value='Moods' className={styles.items}>Moods</option>
                <option value='Memories' className={styles.items}>Memories</option>
                <option value='Running' className={styles.items}>Running</option>
                <option value='Music' className={styles.items}>Music</option>
                <option value='Reading' className={styles.items}>Reading</option>
            </select>
        </div>
        <div className={styles.textField}>
            <label>Tags<span className={styles.textDanger}> *</span></label>
            <input defaultValue={draft.tags} name='tags' type='text' className={styles.textInput} onChange={(e) => dispatch(updateTag(e.target.value.split(', ')))}/>
        </div>
        <div className={styles.textField}>
        <label>Description<span className={styles.textDanger}> *</span></label>
        <textarea defaultValue={draft.desc} name='description' style={{maxHeight:'65px', maxWidth:'250px',minWidth:'250px', minHeight:'28px'}} className={styles.textInput} placeholder='Description' onChange={(e) => dispatch(updateDesc(e.target.value))}></textarea>
        </div>
    </>
  )
}
