import NextAuth from "next-auth";

declare module "next-auth" {
  interface User {
    id: string;
    // other custom fields
  }
  
  interface Session {
    user: User;
  }
}