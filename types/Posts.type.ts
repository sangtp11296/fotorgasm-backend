export type FinalPost = {
  format: string,
  title: string,
  slug: string,
  author: string,
  category: string,
  desc: string,
  tags: string[],
  coverThumbnail: string,
  coverKey: string,
  content?: string,
  coverRes: {
    width: number,
    height: number
  },
  videoSrc?: {
    high: string,
    medium: string,
    low: string,
  }
};
export type FetchedPost = FinalPost & { _id: string, coverUrl: string, createdAt: string, views: string, likes: string, comments: [] };
export type DraftPost = {
  toggle: boolean,
  submit: boolean,
  _id: string,
  format: string,
  title: string,
  slug: string,
  author: string,
  category: string,
  desc: string,
  tags: string[],
  coverThumbnail: string,
  coverUrl: string,
  coverKey: string,
  content: string,
  coverRes: {
    width: number,
    height: number
  },
  createdAt: string, // Add createdAt
  views: string,     // Add views
  likes: string,     // Add likes
  comments: []
};