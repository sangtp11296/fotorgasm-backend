'use client'
import React, { useState } from 'react'
import styles from './TeamContainer.module.css'
import dynamic from 'next/dynamic'
import { useAppSelector } from '@/redux/hooks'
import { TeamList } from './TeamList'
import { UploadVideos } from './UploadVideos'
import { UploadAlbum } from './UploadAlbum'


const Editor = dynamic(() => import('@/components/RichEditor/RichEditor'), { ssr: false });

const TeamContainer: React.FC = () => {
    const editorMode = useAppSelector((state) => state.click.editorMode);
    const postFormat = useAppSelector((state) => state.draft.format);
    const albumFormat = useAppSelector((state) => state.draftAlbum.format)

    const [selectedSongs, setSelectedSongs] = useState<File[]>([]);
    const handleSongList = (fileList: File[]) => {
        setSelectedSongs(fileList);
    };
  return (
      <div className={`${styles.teamContainer} ${styles.gridBlock}`}>
        {!editorMode ?
            <TeamList/>
        : (editorMode && postFormat === 'blog' || postFormat === 'photo') ? 
            <Editor onChange={(v: any)=> console.log(v)}/>
        : (editorMode && postFormat === 'video') ?
            // Upload Videos
            <UploadVideos/>
        : (editorMode && albumFormat === 'album' ) ?
            <UploadAlbum songList={handleSongList}/>
        : ''
        }
    </div>
  )
}

export default TeamContainer