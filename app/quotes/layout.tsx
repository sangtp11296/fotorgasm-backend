import type { Metadata } from 'next'
 
export const metadata: Metadata = {
  title: 'Quotes',
  description: 'Quotes Page',
}

export default function QuotesLayout({
    children, // will be a page or nested layout
  }: {
    children: React.ReactNode
  }) {
    return (
      <section>
        {children}
      </section>
    )
  }