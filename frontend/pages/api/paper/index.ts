// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { collection, doc, getDoc, getDocs, query, setDoc, where } from 'firebase/firestore';
import { db } from 'firebaseClient';
import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react';
import { v4 as uuid } from 'uuid';

type PaperConfig = {
  userId: number;
  friendName: string;
  friendBirth: string;
  uid: string;
  completedUid: string;
  isCompleted: boolean;
  posts: [];
}

const sessions = collection(db, "sessions");
const users = collection(db, "users");
const papersRef = collection(db, "papers");

export default async function handler( req: NextApiRequest, res: NextApiResponse<any> ) {
  const session = await getSession({req});
  const user = session?.user as {
    image: string;
    name: string;
    emailVerified: null|string;
    email: string;
    id: string;
  }
  if (!session) {
    return res.status(401).json({ error: 'Permission Denied' })
  } else {
    const paperData = {
      userName: user.name,
      friendName: req.body.friendName,
      friendBirth: req.body.friendBirth,
      uid: uuid(),
      completedUid: null,
      isCompleted: false,
      posts: [],
    };
    // const paperRef = doc(db, 'papers', user.id);
    // setDoc(doc(paperRef, 'paper'), paperData);
    const q = query(papersRef, where(user.id, '==', true));
    const querySnapshot = await getDocs(q);
    console.log(querySnapshot.docs)
    
    return res.status(200).json({data: paperData});
  }
}
