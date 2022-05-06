// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from 'firebaseClient';
import { v4 as uuid } from 'uuid';

export default async function handler( req: NextApiRequest, res: NextApiResponse<any> ) {
  const session = await getSession({req});
  const user = session?.user as User;
  if (!session) {
    return res.status(401).json({ error: 'Permission Denied' });
  } else {
    if (req.method === "PUT") { // 롤링페이퍼 생성
      try {
        const uid = uuid();
        const paperData = {
          userId: user.id,
          userName: user.name,
          friendName: req.body.name,
          friendBirth: req.body.birthDate,
          completedUid: null,
          isCompleted: false,
          posts: [],
        };
        setDoc(doc(db, `papers/${uid}`), paperData);

        const userRef = doc(db, `users/${user.id}`);
        const userDoc = await getDoc(userRef);
        if (!userDoc.exists()) throw "Document does not exist!"; // 존재하지 않는 문서
        const userPapers = userDoc.data().papers as string[];
        updateDoc(userRef, {papers: [ ...userPapers, uid ]});

        return res.status(200).json({data: {
          ...paperData,
          uid
        }});
      } catch (e) {
        return res.status(401).json({data: null});
      }
      
    }
  } 
}
