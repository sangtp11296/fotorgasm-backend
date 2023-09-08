'use client'
import React, { useEffect, useState } from 'react'
import { Modal } from '@/components/Modal/Modal'
import { FetchedPost } from '@/types/Posts.type';
import { BlogPage } from '@/components/Blog/BlogPage';

const PostModal = async ({ params }: { params: { slug: string } }) => {
  const [post, setPost] = useState<FetchedPost>();
  const [coverUrl, setCoverUrl] = useState()
  // Get Post and Cover
  const handleGetPost = async (slug: string) => {
    const res = await fetch(`https://vjbjtwm3k8.execute-api.ap-southeast-1.amazonaws.com/dev/posts/${slug}`, {
      method: "GET"
    })
    const data = await res.json();
    const post = data.post;
    const fetchCover = await fetch('https://vjbjtwm3k8.execute-api.ap-southeast-1.amazonaws.com/dev/get-draft-image', {
        method: "POST",
        body: JSON.stringify({
          key: post.coverKey,
      }),
    });
    const cover = await fetchCover.json();
    const coverUrl = cover.presignedUrl;
    setCoverUrl(coverUrl);
    setPost(post);
  }
  useEffect(() => {
    handleGetPost(params.slug);
  }, [])
  return (
    <Modal>
        {
          ( post && coverUrl) && <BlogPage post={post} cover={coverUrl}/>
        }
    </Modal>
  )
}

export default PostModal;