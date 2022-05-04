import { NextApiRequest, NextApiResponse } from "next";
import { doc, getDoc } from "firebase/firestore";
import { db } from "firebaseClient";

export default async function handler( req: NextApiRequest, res: NextApiResponse<{paper: null | CompletedPaper}> ) {
  if (req.method === 'GET') {
    const docRef = doc(db, `complete/${req.query.uid}`);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return res.status(200).json({paper: docSnap.data() as CompletedPaper});
    } else {
      return res.status(401).json({paper: null});
    }
  }
}