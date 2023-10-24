import { AlbumPage } from '@/components/Album/Album';
import { BackButton } from '@/components/Button/BackButton';
import { FetchAlbum } from '@/types/Album.type';
import { Metadata, ResolvingMetadata } from 'next';
import React from 'react'

type Props = {
    params: { slug: string }
  }
   
  export async function generateMetadata({ params }: Props, parent: ResolvingMetadata): Promise<Metadata> {
    // read route params
    const slug = params.slug;
   
    // fetch data album
    const res = await fetch(`https://4esg1vvhi3.execute-api.ap-southeast-1.amazonaws.com/dev/music/${slug}`, {
      method: "GET",
      cache: 'no-store'
    })
    const data = await res.json();
    const album: FetchAlbum = data.album;
  
    // optionally access and extend (rather than replace) parent metadata
    const previousImages = (await parent).openGraph?.images || []
   
    return {
      title: `${album.title}: ${album.artists}`,
      description: `${album.title} | ${album.artists}`,
      openGraph: {
        images: ['/some-specific-page-image.jpg', ...previousImages],
      },
    }
  }
export default async function Album({ params }: { params: { slug: string } }) {
    // read route params
    const slug = params.slug;
    // Get Album and Cover
    const res = await fetch(`https://4esg1vvhi3.execute-api.ap-southeast-1.amazonaws.com/dev/music/${slug}`, {
        method: "GET",
        cache: 'no-store'
        })
    const data = await res.json();
    const album: FetchAlbum = data.album;
    const fetchCover = await fetch('https://4esg1vvhi3.execute-api.ap-southeast-1.amazonaws.com/dev/get-file', {
        method: "POST",
        body: JSON.stringify({
            key: album.coverKey,
        }),
        cache: 'no-store'
    });
    const cover = await fetchCover.json();
    const coverUrl = cover.presignedUrl;

    return (
      <>
        <BackButton/>
        {( album && coverUrl) && <AlbumPage album={album} cover={coverUrl}/>}
      </>
    )
}
