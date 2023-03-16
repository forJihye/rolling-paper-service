import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import KakaoProvider from "next-auth/providers/kakao";
import { db } from "lib/firebase-admin";
import { FirestoreAdapter } from "@next-auth/firebase-adapter";
import { collection, query, getDoc, where, limit, doc, getDocs, addDoc, updateDoc, deleteDoc, runTransaction } from "firebase/firestore";

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
  // FIXME: toDate ERROR https://stackoverflow.com/questions/69876727/next-auth-google-auth-firebase-adapter
  adapter: FirestoreAdapter(db),
  secret: process.env.SESSION_SECRET,
  callbacks: {}
})

// import NextAuth from "next-auth";
// import GoogleProvider from "next-auth/providers/google";
// import KakaoProvider from "next-auth/providers/kakao";
// import { FirestoreAdapter } from "@lowfront/firebase-adapter";
// import { db } from "lib/firebase-admin";

// export default NextAuth({
//   providers: [
//     GoogleProvider({
//       clientId: process.env.GOOGLE_CLIENT_ID as string,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
//       authorization: {
//         params: {
//           prompt: "consent",
//           access_type: "offline",
//           response_type: "code",
//           scope: "openid email profile"
//         }
//       }
//     }),
//     KakaoProvider({
//       clientId: process.env.KAKAO_CLIENT_ID as string,
//       clientSecret: process.env.KAKAO_CLIENT_SECRET as string,
//     })
//   ],
//   adapter: FirestoreAdapter(db, {
//     adapterCollectionName: "next-auth"
//   }),
//   secret: process.env.SESSION_SECRET,
// });
