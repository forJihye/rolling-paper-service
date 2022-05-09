import { NextApiRequest, NextApiResponse } from "next";
import { collection, collectionGroup, deleteDoc, doc, getDoc, getDocs, query, runTransaction, setDoc, updateDoc, where } from "firebase/firestore";
import { db } from "firebaseClient";
import { v4 as uuid } from 'uuid';
import { getSession } from "next-auth/react";

export default async function handler( req: NextApiRequest, res: NextApiResponse<any> ) {
  const session = await getSession({req});
  const user = session?.user as User;
  if (!session) {
    return res.status(401).json({ error: 'Permission Denied' });
  } else {
    if (req.method === "POST") { // 롤링페이퍼 완성하기
      try {
        const paperDocRef = doc(db, `papers/${req.body.uid}`);
        const paperDoc = await getDoc(paperDocRef);
        if (!paperDoc.exists()) { // 존재하지 않는 문서
          throw "Document does not exist!";
        }
        const paperData = paperDoc.data();
        const completedUid = uuid();
        updateDoc(paperDocRef, {
          completedUid,
          isCompleted: true
        });
        // 완성 롤릴페이퍼 컬렉션 생성
        const completeRef = collection(db, `complete`);
        const completeDoc = doc(completeRef, completedUid);
        setDoc(completeDoc, {
          posts: [...paperData.posts],
          isCompleted: true
        });
        return res.json({
          completedUid,
          isCompleted: true
        });
      } catch (e) {
        return res.status(401).json({data: null});
      }
    }
  }
}