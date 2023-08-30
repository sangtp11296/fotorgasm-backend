
import React from 'react'
import SubMenu from '../SubMenu/SubMenu'
import PostFeed from '../PostFeed/PostFeed'
import { Photo } from '@/types/Photos.type';
import { Video } from '@/types/Videos.type';
import { getPosts } from '@/utils/getPosts';

async function PostGrid() {

  // Get mixed data from API
  // const mixedData: Promise<(Photo | Video)[]> = getPosts('rock', 1, 5);
  // const data: (Photo | Video)[] = await mixedData;

  return (
    <>
        <SubMenu/>
        <PostFeed data={data}/>
    </>
  )
}

export default PostGrid