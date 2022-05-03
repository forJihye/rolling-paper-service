import { NextApiRequest, NextApiResponse } from "next";
import { deleteDoc, doc, runTransaction } from "firebase/firestore";
import { db } from "firebaseClient";
import { authCatch } from "lib/authCatch";
import { v4 as uuid } from 'uuid';

// FIXME: 브라우저 로컬 스토리지 데이터 저장 필요함. (브라우저마다 메시지 1개만 등록 가능)
export default async function handler( req: NextApiRequest, res: NextApiResponse<any> ) {
  return authCatch(async (req, res, user) => {
    if (req.method === "POST") { // 롤링페이퍼 완성하기
      const paperRef = doc(db, `papers/${user.id}/paper/${req.query.uid}`);
      try {
        await runTransaction(db, async (transaction) => {
          const paperDoc = await transaction.get(paperRef);
          if (!paperDoc.exists()) { // 존재하지 않는 문서
            throw "Document does not exist!";
          }
          const completedUid = uuid();
          transaction.update(paperRef, {
            completedUid,
            isCompleted: true
          });
          return res.json({completedUid});
        })
      } catch (e) {
        return res.status(401).json({data: e});
      }
    } else if (req.method === "DELETE") {
      try {
        const uid = req.query.uid;
        await deleteDoc(doc(db, `papers/${user.id}/paper/${uid}`));
        return res.status(200).json({data: true});
      } catch(e) {
        return res.status(401).json({data: false});
      }
    }
  })(req, res);
}