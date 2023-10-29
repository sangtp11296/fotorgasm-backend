// export interface fetchedVideo {
//     page: number;
//     per_page: number;
//     total_results: number;
//     url: string;
//     videos: Video[];
// }
export type Song = {
  title: string,
  trackNum: number,
  artists: string[],
  album: string,
  composers: string[],
  genres: string[],
  year: number,
  date: string,
  picture: string,
  thumbnail: string,
  srcKey: string
}
export type Artist = {
  name: string,
  bio: {
    content: string,
    summary: string
  },
  avatar: string
}
export type FetchAlbum = {
  _id: string,
  format: string,
  title: string,
  slug: string,
  artists: Artist[],
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
  dominantColor: string,
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
  artists: Artist[],
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
  dominantColor: string,
  status: string,
};
export interface DraftAlbum {
  submit: boolean,
  _id: string,
  format: string,
  title: string,
  slug: string,
  artists: Artist[],
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
  dominantColor: string,
  views: string,     // Add views
  likes: number,     // Add likes
  status: string,
}

