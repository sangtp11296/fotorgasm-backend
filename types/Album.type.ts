// export interface fetchedVideo {
//     page: number;
//     per_page: number;
//     total_results: number;
//     url: string;
//     videos: Video[];
// }
export interface DraftAlbum {
  toggle: boolean,
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

