export type FinalPost = {
  format: string,
  title: string,
  slug: string,
  author: string,
  category: string,
  description: string,
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
}
export type DraftPost = {
  toggle: boolean,
  submit: boolean,
  id: string,
  format: string,
  title: string,
  slug: string,
  author: string,
  category: string,
  description: string,
  tags: string[],
  coverThumbnail: string,
  coverUrl: string,
  coverKey: string,
  content: string,
  coverRes: {
    width: number,
    height: number
  }
}