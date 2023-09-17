import AuthProvider from '@/components/AuthProvider/AuthProvider'
import { Providers } from '@/redux/provider'
import '@/styles/globals.css'

export const metadata = {
    title: {
      default: 'fotorgasm',
      template: '%s | fotorgasm'
    },
    description: 'Orgasm Through My Lens'
}

const RootLayout = ( props: {
                      children: React.ReactNode
                      modal: React.ReactNode
                    }) => {
  return (
    <html lang='en'>
      <head>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css"/>
      </head>
      <body suppressHydrationWarning={true} >
        <AuthProvider>
          <Providers>
            {props.children}
            {props.modal}
          </Providers>
        </AuthProvider>
      </body>
    </html>
  )
}

export default RootLayout