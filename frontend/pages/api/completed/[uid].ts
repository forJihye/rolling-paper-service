import { NextApiRequest, NextApiResponse } from "next";
import { collection, doc, getDocs, query, runTransaction, where } from "firebase/firestore";
import { app, db } from "firebaseClient";

const papersRef = collection(db, "papers");
export default async function handler( req: NextApiRequest, res: NextApiResponse<any> ) {
  if (req.method === 'GET') {
    const querySnapshot = await getDocs(papersRef);
    querySnapshot.forEach((doc) => {
      console.log(`${doc.id}`);
    });
    return res.status(200).json({data: true});
  }
}