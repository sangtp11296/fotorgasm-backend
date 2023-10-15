'use client'
import React from 'react'
import styles from './TeamContainer.module.css'
import dynamic from 'next/dynamic'
import { useAppSelector } from '@/redux/hooks'
import { TeamList } from './TeamList'
import { UploadVideos } from './UploadVideos'
import { UploadAlbum } from './UploadAlbum'


const Editor = dynamic(() => import('@/components/RichEditor/RichEditor'), { ssr: false });

const TeamContainer: React.FC = () => {
    const editorMode = useAppSelector((state) => state.draft.toggle);
    const format = useAppSelector((state) => state.draft.format);
    
  return (
      <div className={`${styles.teamContainer} ${styles.gridBlock}`}>
        {!editorMode ?
            <TeamList/>
        : (editorMode && format === 'blog' || format === 'photo') ? 
            <Editor onChange={(v: any)=> console.log(v)}/>
        : (editorMode && format === 'video') ?
            // Upload Videos
            <UploadVideos/>
        : (editorMode && format === 'album' ) ?
            <UploadAlbum/>
        : ''
        }
    </div>
  )
}

export default TeamContainer