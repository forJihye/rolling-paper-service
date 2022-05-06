// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react';
import { doc, getDoc, runTransaction } from 'firebase/firestore';
import { db } from 'firebaseClient';

export default async function handler( req: NextApiRequest, res: NextApiResponse<any> ) {
  const session = await getSession({req});
  const user = session?.user as User;
  // if (!session) {
  //   return res.status(401).json({ error: 'Permission Denied' });
  // } else {
    //FIXME: Next page 렌더링 늦음
    if (req.method === 'GET') { // 유저가 만든 모든 롤링페이퍼 가져오기
      try {
        const userDocRef = doc(db, `users/${user.id}`);
        const userDoc = await getDoc(userDocRef);
        if (!userDoc.exists()) throw "Document does not exist!";
        const userPapers = userDoc.data().papers;
        const data = userPapers.map(async (paperUid: string) => {
          const paperDocRef = doc(db, `papers/${paperUid}`);
          const paperDoc = await getDoc(paperDocRef);
          return {
            ...paperDoc.data(),
            uid: paperUid
          };
        })
        const result = await Promise.all(data);
        return res.status(200).json({papers: result});
      } catch (e) {
        return res.status(401).json({papers: null});
      }

      // const userDocRef = doc(db, `users/${user.id}`);
      // const userSnap = await getDoc(userDocRef);
      // if (userSnap.exists()) {
      //   const {papers} = userSnap.data();
      //   const userPapersData = papers.map(async (paperUid: string) => {
      //     const paperRef = doc(db, "papers", paperUid);
      //     const paperSnap = await getDoc(paperRef);
      //     const data = paperSnap.data() as PaperData;
      //     return {
      //       ...data,
      //       uid: paperUid
      //     }
      //   });
      //   const paperData = await Promise.all(userPapersData);
      //   return res.json({papers: paperData});
      // } else {
      //   return res.status(401).json({ error: 'No such document!' });
      // }
    } 
  // } 
}
