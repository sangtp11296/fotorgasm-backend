import '@/styles/globals.css'

export const metadata = {
    title: 'fotorgasm',
    description: 'Orgasm Through My Lens'
}

const RootLayout = ({ children }: { children: React.ReactNode}) => {
  return (
    <html lang='en'>
        <body>
            {children}
        </body>
    </html>
  )
}

export default RootLayout