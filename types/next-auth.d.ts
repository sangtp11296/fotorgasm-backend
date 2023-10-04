import NextAuth, { DefaultSession } from "next-auth"

declare module "next-auth" {
  
  interface Session {
    user: {
      id: string,
      avatar: string,
      role: string,
      team: string
      // team: {
      //   name: string;
      //   role: string[];
      //   avatar: string;
      //   _id: string;
      // }[]
    } & DefaultSession["user"]
  }
}