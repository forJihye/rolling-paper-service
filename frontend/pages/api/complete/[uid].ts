import { NextApiRequest, NextApiResponse } from "next";
import { doc, getDoc } from "firebase/firestore";
import { db } from "firebaseClient";

export default async function handler( req: NextApiRequest, res: NextApiResponse<{data: null | CompletedPaper}> ) {
  if (req.method === 'GET') {
    const docRef = doc(db, `complete/${req.query.uid}`);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data() as CompletedPaper;
      return res.status(200).json({data});
    } else {
      return res.status(401).json({data: null});
    }
  }
}