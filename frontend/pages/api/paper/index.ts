// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react';
import { collection, deleteDoc, doc, getDoc, getDocs, query, setDoc } from 'firebase/firestore';
import { db } from 'firebaseClient';
import { v4 as uuid } from 'uuid';

export default async function handler( req: NextApiRequest, res: NextApiResponse<any> ) {
  const session = await getSession({req});
  const user = session?.user as User;
  if (!session) {
    return res.status(401).json({ error: 'Permission Denied' });
  } else {
    if (req.method === "PUT") { // 롤링페이퍼 생성
      const paperData = {
        userName: user.name,
        friendName: req.body.friendName,
        friendBirth: req.body.friendBirth,
        completedUid: null,
        isCompleted: false,
        posts: [],
      };
      // papers/CBjzdw4Dla2mLnzfllTn/paper/697da934-b80c-4ce3-b7cc-ec17228f52e6
      const uid = uuid();
      const paperRef = collection(db, `papers/${user.id}/paper`);
      setDoc(doc(paperRef, uid), paperData);
      return res.status(200).json({data: {
        ...paperData,
        uid
      }});
    } else if (req.method === 'GET') { // 유저가 만든 모든 롤링페이퍼 가져오기
      const papersRef = collection(db, `papers/${user.id}/paper`);
      const paperDocs = await getDocs(query(papersRef));
      if (paperDocs.empty) {
        return res.status(401).json({data: null});
      } else {
        const data: any = [];
        paperDocs.forEach(doc => {
          data.push({
            ...doc.data(),
            uid: doc.id
          });
        });
        return res.json({data});
      }
    } 
  } 
}
