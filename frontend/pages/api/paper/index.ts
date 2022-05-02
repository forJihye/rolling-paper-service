// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react';
import { collection, doc, getDocs, query, setDoc } from 'firebase/firestore';
import { db } from 'firebaseClient';
import { v4 as uuid } from 'uuid';

export default async function handler( req: NextApiRequest, res: NextApiResponse<any> ) {
  const session = await getSession({req});
  const user = session?.user as User;
  if (!session) {
    return res.status(401).json({ error: 'Permission Denied' });
  } else {
    if (req.method === "POST") {
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
    }
  }
}
