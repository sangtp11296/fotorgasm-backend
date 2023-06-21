import React from 'react'
import styles from './Video.module.css'
import { Photo } from '@/types/Photos.type'
import { Video } from '@/types/Videos.type'

interface Props {
  video: Photo | Video
}
const VideoPost = ({ video }) => {
  return (
    <div>Video</div>
  )
}

export default VideoPost