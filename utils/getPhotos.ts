import { Photo, fetchedPhoto } from "@/types/Photos.type";

export const  getPhotos = async (page: number | string, perPage: number | string) => {
    const res = await fetch(`https://api.unsplash.com/photos?page=${page}&?per_page=${perPage}&client_id=oToAvK2epPDap7yqFnLiUzugpJ2Za7bOuPgu2Crq_QE`)
    
    if (!res.ok) {
      throw new Error('Failed to fetch data')
    }
    const photosData: fetchedPhoto[] = await res.json();
    const photos: Photo[] = photosData.map(({
      id, created_at, width, height, likes, description, alt_description, urls
    }: fetchedPhoto) => (
      {
      id, created_at, width, height, likes, description, alt_description, urls
      }
    ))
    return photos
};