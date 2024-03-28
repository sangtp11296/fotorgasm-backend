import { FetchedPost } from '@/types/Posts.type'
import React, { useCallback, useEffect, useState } from 'react'
import styles from './GridContainer.module.css'
import PostThumbnail from '../PostThumbnail/PostThumbnail'
import Link from 'next/link'
import { useAppDispatch } from '@/redux/hooks'
import { getPosts } from '@/utils/getPosts'
import { updateFetchedPost } from '@/redux/post/fetchPosts.slice'
import InfiniteScroll from 'react-infinite-scroll-component'
import { SkeletonLoading } from '../SkeletonLoading/SkeletonLoading'
import { Quotes } from '../Quotes/Quotes'

type Props = {
    format: string
}

export const PostFeed: React.FC<Props> = ({ format }) => {

    const [posts, setPosts] = useState<FetchedPost[]>([]);
    const [hasMore, setHasMore] = useState<boolean>(true);
    const [page, setPage] = useState<number>(2)

    const dispatch = useAppDispatch();
     // Get first time loading posts
    const handleGetPosts = async (page: number) => {
        const res = getPosts(format, page, 5);
        setPosts((await res).posts);
        // For next prev post function
        dispatch(updateFetchedPost((await res).posts))
    }

    useEffect(() => {
        setPage(2);
        setHasMore(true);
        handleGetPosts(1);
    }, [format])
    
    // Get more posts
    const getMoreItems = async () => {
        try{
        const res = getPosts(format, page, 5);
        const posts = (await res).posts;
        if (posts.length > 0){
            setPosts((prevPhotos) => [...prevPhotos, ...posts]);
            dispatch(updateFetchedPost(posts));
            setPage((prevPage) => prevPage + 1)
        } else {
            setHasMore(false);
        }
        } catch (err) {
        console.error('Error fetching posts:', err);
        }
    }
    // Focus to chosen post
    const handleClick = useCallback((id: string) => {
        const element = document.getElementById(id);
        if (element) {
        const { top, height } = element.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        const scrollPosition = top + window.scrollY - (windowHeight / 2) + (height / 2);
        window.scrollTo({
            top: scrollPosition,
            behavior: 'smooth',
        });
        }
    }, []);
    return(
        <>
            <InfiniteScroll 
                dataLength={posts.length}
                next={getMoreItems}
                hasMore={hasMore}
                loader={<></>}
                style={{ overflow: 'hidden' }}
                scrollThreshold={0.7}
            >
                <div className={`${styles.masonryContainer}`}>
                {
                    posts.map((post) => {
                        return(
                            <Link key={post._id} onClick={(e) => handleClick(post._id)} href={`/posts/${post.slug}`} className={`${styles.postWrapper} ${post.coverRes.width < post.coverRes.height ? styles.portrait : (post.coverRes.width > post.coverRes.height ? styles.landscape : styles.square)}`} scroll={false}>
                                <PostThumbnail data={post}/>
                            </Link>
                            )
                        }
                    )
                }
                {
                    hasMore && <SkeletonLoading format={format}/>
                }
                </div>
            </InfiniteScroll>
            <Quotes invisible={!hasMore}/>
        </>

    )
}
