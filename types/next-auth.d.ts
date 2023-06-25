import NextAuth, { DefaultSession } from "next-auth"

declare module "next-auth" {
  
  interface Session {
    user: {
      id: string,
      avatar: string
    } & DefaultSession["user"]
  }
}