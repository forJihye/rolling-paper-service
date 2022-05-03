import { deleteDoc, doc, runTransaction } from "firebase/firestore";
import { db } from "firebaseClient";
import { authCatch } from "lib/authCatch";
import { NextApiRequest, NextApiResponse } from "next";

// FIXME: 브라우저 로컬 스토리지 데이터 저장 필요함. (브라우저마다 메시지 1개만 등록 가능)
export default async function handler( req: NextApiRequest, res: NextApiResponse<any> ) {
  return authCatch(async (req, res, user) => {
    if (req.method === "POST") {
      const paperRef = doc(db, `papers/${user.id}/paper/${req.query.uid}`);
      try {
        await runTransaction(db, async (transaction) => {
          const paperDoc = await transaction.get(paperRef);
          if (!paperDoc.exists()) { // 존재하지 않는 문서
            throw "Document does not exist!";
          }
          const posts = paperDoc.data().posts;
          posts.push({
            name: req.body.name,
            message: req.body.message
          });
          transaction.update(paperRef, { posts: [...posts] });
          return res.json({data: posts});
        })
      } catch (e) {
        return res.status(401).json({data: e});
      }
    } 
  })(req, res);
}