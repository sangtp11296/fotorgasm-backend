
import { BlogPage } from '@/components/Blog/BlogPage';
import { FetchedPost } from '@/types/Posts.type';
import React from 'react'

import type { Metadata, ResolvingMetadata } from 'next'
 
type Props = {
  params: { slug: string }
  searchParams: { [key: string]: string | string[] | undefined }
}
 
export async function generateMetadata({ params, searchParams }: Props, parent: ResolvingMetadata): Promise<Metadata> {
  // read route params
  const slug = params.slug
 
  // fetch data post
  const res = await fetch(`https://vjbjtwm3k8.execute-api.ap-southeast-1.amazonaws.com/dev/posts/${slug}`, {
    method: "GET"
  })
  const data = await res.json();
  const post: FetchedPost = data.post;

  // optionally access and extend (rather than replace) parent metadata
  const previousImages = (await parent).openGraph?.images || []
 
  return {
    title: `${post.title}: ${post.author}`,
    description: `${post.title} | ${post.author}`,
    openGraph: {
      images: ['/some-specific-page-image.jpg', ...previousImages],
    },
  }
}

const PostPage = async ({ params }: { params: { slug: string } }) => {
  
  // Get Post and Cover
  const res = await fetch(`https://vjbjtwm3k8.execute-api.ap-southeast-1.amazonaws.com/dev/posts/${params.slug}`, {
      method: "GET"
    })
    const data = await res.json();
    const post: FetchedPost = data.post;
    const fetchCover = await fetch('https://vjbjtwm3k8.execute-api.ap-southeast-1.amazonaws.com/dev/get-draft-image', {
        method: "POST",
        body: JSON.stringify({
          key: post.coverKey,
      }),
    });
    const cover = await fetchCover.json();
    const coverUrl = cover.presignedUrl;
  return (
    ( post && coverUrl) && <BlogPage post={post} cover={coverUrl}/>
  )
}

export default PostPage