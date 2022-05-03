import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";


export const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
  measurementId: process.env.FIREBASE_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { app, db };
// const secret = process.env.NEXTAUTH_SECRET
// export default async (req: NextApiRequest, res: NextApiResponse) => {
//   const token = await getToken({ req, secret })
//   res.send(JSON.stringify(token, null, 2))
// }
// export default async (req: NextApiRequest, res: NextApiResponse) => {
//   const session = await getSession({ req })
//   res.send(JSON.stringify(session, null, 2))
// }