import NextAuth from "next-auth/next";
import GoogleProvider from 'next-auth/providers/google';

export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
          scope: "openid email profile"
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token }) {
      token.userRole = "admin"
      return token
    },
  },
  // session: {
  //   strategy: 'jwt',
  //   maxAge: 30 * 24 * 60 * 60, // 30 days
  //   updateAge: 24 * 60 * 60, // 24 hours
  // },
  // secret: process.env.SESSION_SECRET,
  // callbacks: {
  //   async session(session, user, token) {
  //     return session;
  //   },
  // }
})