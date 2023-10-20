
import React, { useCallback, useEffect, useState } from 'react'
import styles from './GridContainer.module.css'
import Link from 'next/link'
import InfiniteScroll from 'react-infinite-scroll-component'
import { SkeletonLoading } from '../SkeletonLoading/SkeletonLoading'
import { FetchAlbum } from '@/types/Album.type'
import { getAlbums } from '@/utils/getMusic'
import { AlbumThumbnail } from '../AlbumThumbnail/AlbumThumbnail'

type Props = {
    format: string
}

export const AlbumFeed: React.FC<Props> = ({ format }) => {

    const [albums, setAlbums] = useState<FetchAlbum[]>([]);
    const [hasMore, setHasMore] = useState<boolean>(true);
    const [page, setPage] = useState<number>(2)

     // Get first time loading albums
    const handleGetalbums = async (page: number) => {
        const res = getAlbums(page, 5);
        setAlbums((await res).albums);
    }

    useEffect(() => {
        setPage(2);
        setHasMore(true);
        handleGetalbums(1);
    }, [format])
    
    // Get more albums
    const getMoreItems = async () => {
        try{
        const res = getAlbums(page, 5);
        const albums = (await res).albums;
        if (albums.length > 0){
            setAlbums((prevAlbums) => [...prevAlbums, ...albums]);
            setPage((prevPage) => prevPage + 1)
        } else {
            setHasMore(false);
        }
        } catch (err) {
        console.error('Error fetching albums:', err);
        }
    }
    // Focus to chosen album
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
        <InfiniteScroll 
            dataLength={albums.length}
            next={getMoreItems}
            hasMore={hasMore}
            loader={<></>}
            style={{ overflow: 'hidden' }}
            scrollThreshold={0.7}
        >
            <div className={`${styles.masonryContainer} ${styles.albumGrid}`}>
            {
                albums.map((album) => {
                    return(
                        <Link key={album._id} onClick={(e) => handleClick(album._id)} href={`/albums/${album.slug}`} className={`${styles.albumWrapper}}`}>
                            <AlbumThumbnail data={album}/>
                        </Link>
                    )
                })
            }
            {
                hasMore && <SkeletonLoading format={format}/>
            }
            </div>
        </InfiniteScroll>
    )
}
