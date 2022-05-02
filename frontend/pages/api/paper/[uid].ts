import { collection, collectionGroup, doc, getDocs, query } from "firebase/firestore";
import { db } from "firebaseClient";
import { authCatch } from "helper/authCatch";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler( req: NextApiRequest, res: NextApiResponse<any> ) {
  return authCatch(async (req, res, user) => {
    // const papersRef = doc(db, 'papers', user.id);
    const paperRef = collection(db, `papers/${user.id}/paper/`);
    const q = query(paperRef);
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach(data => {
      // posts 필드 데이터 추가 (배열)
    })

    return res.json({message: 'ok'});
  })(req, res);
}