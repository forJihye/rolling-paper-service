import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import KakaoProvider from "next-auth/providers/kakao";
import { db } from "lib/firebase-client";
import { FirebaseAdapter } from "@next-auth/firebase-adapter";
import { collection, query, getDoc, where, limit, doc, getDocs, addDoc, updateDoc, deleteDoc, runTransaction } from "firebase/firestore";
// import { FirestoreAdapter } from "@lowfront/firebase-adapter";

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
    }),
    KakaoProvider({
      clientId: process.env.KAKAO_CLIENT_ID as string,
      clientSecret: process.env.KAKAO_CLIENT_SECRET as string,
    })
  ],
  // adapter: FirestoreAdapter(db),
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
