export type PreviewPost = {
  id?: string,
  format?: string,
  title?: string,
  slug?: string,
  author?: string,
  category?: string,
  description?: string,
  tags?: string[],
  cover?: string | null,
  content?: string,
  coverRes?: {
    width: number,
    height: number
  }
}
export type DraftPost = {
  toggle: boolean,
  id: string,
  format: string,
  title: string,
  slug: string,
  author: string,
  category: string,
  description: string,
  tags: string[],
  cover: string | null,
  coverUrl: string,
  content: string,
  coverRes: {
    width: number,
    height: number
  }
}