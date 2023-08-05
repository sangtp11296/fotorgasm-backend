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
  id: string,
  format: string,
  title: string,
  slug: string,
  author: string,
  category: string,
  description: string,
  tags: string[],
  coverUrl: string,
  content: string,
  coverRes: {
    width: number,
    height: number
  }
}