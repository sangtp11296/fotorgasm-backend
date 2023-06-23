
import React from 'react'
import SubMenu from '../SubMenu/SubMenu'
import PostFeed from '../PostFeed/PostFeed'
import { Photo } from '@/types/Photos.type';
import { getPhotos } from '@/utils/getPhotos';
import { getVideos } from '@/utils/getVideos';
import { Video } from '@/types/Videos.type';
import { getPosts } from '@/utils/getPosts';

async function PostGrid() {
  // Get photos from API
  const photoData: Promise<Photo[]> = getPhotos(1, 10);
  const photos: Photo[] = await photoData;

  // Get mixed data from API
  const mixedData: Promise<(Photo | Video)[]> = getPosts('rock', 1, 5);
  const data: (Photo | Video)[] = await mixedData;
  return (
    <>
        <SubMenu/>
        <PostFeed data={data}/>
    </>
  )
}

export default PostGrid