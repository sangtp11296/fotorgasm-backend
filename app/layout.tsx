import AuthProvider from '@/components/AuthProvider/AuthProvider'
import { Providers } from '@/redux/provider'
import '@/styles/globals.css'

export const metadata = {
    title: 'fotorgasm',
    description: 'Orgasm Through My Lens'
}

const RootLayout = ({ children }: { children: React.ReactNode}) => {
  return (
    <html lang='en'>
      <head>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css"/>
      </head>
      <body suppressHydrationWarning={true} >
        <AuthProvider>
          <Providers>
            {children}
          </Providers>
        </AuthProvider>
      </body>
    </html>
  )
}

export default RootLayout