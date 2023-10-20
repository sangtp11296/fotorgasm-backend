import NextAuth, { Awaitable, RequestInternal, Session, User } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import CredentialsProvider from 'next-auth/providers/credentials'


const handler = NextAuth({
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        }),
        CredentialsProvider({
            // The name to display on the sign in form (e.g. "Sign in with...")
            name: "Credentials",
            // `credentials` is used to generate a form on the sign in page.
            // You can specify which fields should be submitted, by adding keys to the `credentials` object.
            // e.g. domain, username, password, 2FA token, etc.
            // You can pass any HTML attribute to the <input> tag through the object.
            credentials: {
              username: { label: "Username", type: "text", placeholder: "jsmith" },
              password: { label: "Password", type: "password" }
            },
            async authorize(credentials, req){
              // Add logic here to look up the user from the credentials supplied
              const res = await fetch('https://4esg1vvhi3.execute-api.ap-southeast-1.amazonaws.com/dev/login',{
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                      username: credentials?.username,
                      password: credentials?.password
                  })
                }
              )
              if( res.status === 200) {
                const data = await res.json();
                console.log(data, 'data');
                if (data) {
                  const user = { 
                    id: data.userData.id, 
                    name: data.userData.username, 
                    email: data.userData.email,
                    avatar: data.userData.avatar,
                    role: data.userData.role,
                    team: data.userData.team
                  }
                  console.log(user, 'user')
                  return Promise.resolve(user) 
                } else {
                  return null
                }
              }
              // Return null if the response status is not 200
              return null;
            }
          }),
    ],
    session:{
      maxAge: 2 * 60 * 60 // 2 hours
    },
    callbacks: {
      jwt: ({ token, user }) => {
        if(user) {
          const u = user as unknown as any;
          return {
            ...token,
            id: u.id,
            avatar: u.avatar,
            role: u.role,
            team: u.team
          }
        }
        return token
      },
      session: ({ session, token }) => {
        return {
          ...session,
          user: {
            ...session.user,
            id: token.id,
            avatar: token.avatar,
            role: token.role,
            team: token.team
          }
        }
      }
    }
})

export { handler as GET, handler as POST }