import { NextApiRequest, NextApiResponse } from "next";
import { deleteDoc, doc, getDoc, runTransaction } from "firebase/firestore";
import { db } from "firebaseClient";
import { getSession } from "next-auth/react";

export default async function handler( req: NextApiRequest, res: NextApiResponse<any> ) {
  if (req.method === "GET") { // 롤링페이퍼 데이터 가져오기
    const paperDocRef = doc(db, `papers/${req.query.uid}`);
    const paperDoc = await getDoc(paperDocRef);
    const paperData = paperDoc.data() as PaperData;
    return res.json({paper: paperData}); 
  } 
  else if (req.method === 'DELETE') { // 롤링페이퍼 삭제
    const session = await getSession({req});
    const user = session?.user as User;
    if (!session) {
      return res.status(401).json({ error: 'Permission Denied' });
    } else {
      const userDocRef = doc(db, `users/${user.id}`);
      try {
        await runTransaction(db, async (transaction) => {
          await deleteDoc(doc(db, `papers/${req.query.uid}`));
          const userDoc = await transaction.get(userDocRef);
          if (!userDoc.exists()) throw "Document does not exist!";
          const userPapers = userDoc.data().papers;
          const updateUserPapers = userPapers.filter((paperUid: string) => paperUid !== req.query.uid);
          transaction.update(userDocRef, {
            papers: updateUserPapers
          });
        });
        return res.status(200).json({data: true});
      } catch(e) {
        return res.status(401).json({data: false});
      }
    }
  }
}