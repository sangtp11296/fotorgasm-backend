import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import CredentialsProvider from 'next-auth/providers/credentials'

const handler = NextAuth({
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        }),
        CredentialsProvider({
            id: "creadentials",
            name: "Credentials",
            credentials: {
                username: { label: "Username", type: "text", placeholder: "Welcome Back!" },
                password: { label: "Password", type: "password" }
              },
            async authorize(credentials) {

            },
        })
    ],
})

export { handler as GET, handler as POST }