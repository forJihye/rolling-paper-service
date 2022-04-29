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

export default async function handler( req: NextApiRequest, res: NextApiResponse<any> ) {
  const session = await getSession({req});
  const user = session?.user as {
    image: string;
    name: string;
    emailVerified: null|string;
    email: string;
    id: string;
  }
  // console.log(req.cookies['next-auth.session-token'])
  if (!session) {
    return res.status(401).json({ error: 'Permission Denied' })
  } else {
    const paperRef = doc(db, 'papers', user.id);
    const paperData = {
      userName: user.name,
      friendName: req.body.friendName,
      friendBirth: req.body.friendBirth,
      uid: uuid(),
      completedUid: null,
      isCompleted: false,
      posts: [],
    };
    setDoc(doc(paperRef, 'paper'), paperData);
    return res.status(200).json({data: paperData});
  }
}
