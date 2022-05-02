import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { FirebaseAdapter } from "@next-auth/firebase-adapter";
import { collection, query, getDoc, where, limit, doc, getDocs, addDoc, updateDoc, deleteDoc, runTransaction } from "firebase/firestore";
import { db } from "firebaseClient";

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
// FIXME: toDate ERROR https://stackoverflow.com/questions/69876727/next-auth-google-auth-firebase-adapter
  adapter: FirebaseAdapter({
    db,
    collection,
    query,
    getDocs,
    where,
    limit,
    doc,
    getDoc,
    addDoc,
    updateDoc,
    deleteDoc,
    runTransaction
  }),
  secret: process.env.SESSION_SECRET,
  callbacks: {
    async session({ session, user, token }) {
      return {
        ...session,
        user
      };
    },
    async jwt ({token, user, account, profile, isNewUser}) {
      if (account) { // 로그인 직후 토큰에 대한 OAuth access_token 유지
        token.accessToken = account.access_token
      }
      return token;
    }
  }
})
