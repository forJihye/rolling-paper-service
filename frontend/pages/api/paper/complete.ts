import { NextApiRequest, NextApiResponse } from "next";
import { collection, collectionGroup, deleteDoc, doc, getDoc, getDocs, query, runTransaction, setDoc, updateDoc, where } from "firebase/firestore";
import { db } from "firebaseClient";
import { authCatch } from "lib/authCatch";
import { v4 as uuid } from 'uuid';

// FIXME: 브라우저 로컬 스토리지 데이터 저장 필요함. (브라우저마다 메시지 1개만 등록 가능)
export default async function handler( req: NextApiRequest, res: NextApiResponse<any> ) {
  return authCatch(async (req, res, user) => {
    if (req.method === "POST") { // 롤링페이퍼 완성하기
      const paperDocRef = doc(db, `papers/${req.body.uid}`);
      try {
        await runTransaction(db, async (transaction) => {
          const paperDoc = await transaction.get(paperDocRef);
          if (!paperDoc.exists()) { // 존재하지 않는 문서
            throw "Document does not exist!";
          }
          const paperData = paperDoc.data();
          const completedUid = uuid();
          transaction.update(paperDocRef, {
            completedUid,
            isCompleted: true
          });
          // 완성 롤릴페이퍼 컬렉션 생성
          const completeRef = collection(db, `complete`);
          setDoc(doc(completeRef, completedUid), {
            posts: [...paperData.posts],
            isCompleted: true
          });
          return res.json({
            completedUid,
            isCompleted: true
          });
        })
      } catch (e) {
        return res.status(401).json({data: null});
      }
    }
  })(req, res);
}