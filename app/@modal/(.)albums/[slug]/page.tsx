import { AlbumPage } from '@/components/Album/Album';
import { BackButton } from '@/components/Button/BackButton';
import { Modal } from '@/components/Modal/Modal';
import { FetchAlbum } from '@/types/Album.type';
import React from 'react'

export default async function AlbumModal({ params }: { params: { slug: string } }) {
    // read route params
    const slug = params.slug;
    console.log(slug)
    // Get Album and Cover
    const res = await fetch(`https://4esg1vvhi3.execute-api.ap-southeast-1.amazonaws.com/dev/music/${slug}`, {
        method: "GET",
        cache: 'no-store'
        })
    const data = await res.json();
    const album: FetchAlbum = data.album;
    const fetchCover = await fetch('https://4esg1vvhi3.execute-api.ap-southeast-1.amazonaws.com/dev/get-draft-image', {
        method: "POST",
        body: JSON.stringify({
            key: album.coverKey,
        }),
        cache: 'no-store'
    });
    const cover = await fetchCover.json();
    const coverUrl = cover.presignedUrl;
    return (
        <Modal params={params}>
            <BackButton/>
            {
                ( album && coverUrl) && <AlbumPage album={album} cover={coverUrl}/>
            }
        </Modal>
    )
}
