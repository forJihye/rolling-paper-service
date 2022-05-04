import { NextApiRequest, NextApiResponse } from "next";
import { collection, doc, getDoc, getDocs, query, runTransaction, where } from "firebase/firestore";
import { app, db } from "firebaseClient";


export default async function handler( req: NextApiRequest, res: NextApiResponse<any> ) {
  if (req.method === 'GET') {
    const docRef = doc(db, `complete/${req.query.uid}`);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return res.status(200).json({data: docSnap.data()});
    } else {
      return res.status(401).json({data: null});
    }
  }
}