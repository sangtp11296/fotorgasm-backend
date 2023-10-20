// export interface fetchedVideo {
//     page: number;
//     per_page: number;
//     total_results: number;
//     url: string;
//     videos: Video[];
// }
export type FetchAlbum = {
  _id: string,
  format: string,
  title: string,
  slug: string,
  artists: string[],
  composers: string[],
  genres: string[],
  desc: string,
  distinctions: string[],
  year: number
  tags: string[],
  coverRes: {
    width: number,
    height: number
  },
  likes: number
  views: number
  status: string,
  songs: [],
  createdAt: string,
  coverKey: string,
  coverThumbnail: string,
  coverUrl?: string
}
export type FinalAlbum = {
  format: string,
  title: string,
  slug: string,
  artists: string[],
  genres: string[],
  composers: string[],
  tags: string[],
  year: number,
  distinctions: string[],
  desc: string,
  coverRes: {
    width: number,
    height: number
  },
  status: string,
};
export interface DraftAlbum {
  submit: boolean,
  _id: string,
  format: string,
  title: string,
  slug: string,
  artists: string[],
  genres: string[],
  songs: string[],
  composers: string[],
  tags: string[],
  year: number,
  distinctions: string[],
  desc: string,
  coverThumbnail: string,
  coverUrl: string,
  coverKey: string,
  coverRes: {
    width: number,
    height: number
  },
  views: string,     // Add views
  likes: number,     // Add likes
  status: string,
}

