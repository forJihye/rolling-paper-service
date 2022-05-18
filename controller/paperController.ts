import { deleteDoc, doc, getDoc, runTransaction, setDoc, updateDoc } from "firebase/firestore";
import { db } from "lib/firebase-client";
import { nanoid } from "nanoid";
import { NextApiRequest, NextApiResponse } from "next";
import { Session } from "next-auth";
import { getSession } from "next-auth/react";
import { CreatePaperInput } from "pages/api/paper";

export const createPaper = async (
  req: NextApiRequest, 
  res: NextApiResponse<{ data: PaperData | null; }>,
  body: CreatePaperInput
) => {
  const session = await getSession({req});
  const user = session?.user as Session;
  try {
    const data = await runTransaction(db, async (transaction) => {
      const uid = nanoid();
      const paperData = {
        userId: user.id,
        userName: user.name,
        friendName: body.name,
        friendBirth: body.birthDate,
        completedUid: '',
        isCompleted: false,
        posts: [],
      };
      const userRef = doc(db, `users/${user.id}`);
      const userDoc = await transaction.get(userRef);
      if (!userDoc.exists()) throw "Document does not exist!"; // 존재하지 않는 문서
      const userPapers = userDoc.data().papers as string[] ?? [];
      await transaction.set(doc(db, `papers/${uid}`), paperData);
      await transaction.update(userRef, { papers: [...userPapers, uid] });
      return { ...paperData, uid } as PaperData;
    });
    return res.status(200).json({data: data});
  } catch (e) {
    return res.status(401).json({data: null});
  }
}

export const getPaperByUid = async (req: NextApiRequest, res: NextApiResponse<{paper: PaperData|null}>) => {
  const paperDocRef = doc(db, `papers/${req.query.uid}`);
  const paperDoc = await getDoc(paperDocRef);
  const paperData = paperDoc.data() as PaperData;
  if (paperData) return res.json({paper: paperData}); 
  else return res.status(401).json({paper: null});
}

export const deletePaperByUid = async (req: NextApiRequest, res: NextApiResponse<{data: boolean}>) => {
  const session = await getSession({req});
  const user = session?.user as User;
  if (!session) throw 'Permission Denied';
  else {
    try {
      const userDocRef = doc(db, `users/${user.id}`);
      await deleteDoc(doc(db, `papers/${req.query.uid}`));
      const userDoc = await getDoc(userDocRef);
      if (!userDoc.exists()) throw "Document does not exist!";
      const userPapers = userDoc.data().papers;
      const updateUserPapers = userPapers.filter((paperUid: string) => paperUid !== req.query.uid);
      updateDoc(userDocRef, {
        papers: updateUserPapers
      });
      return res.status(200).json({data: true});
    } catch(e) {
      return res.status(401).json({data: false});
    }
  }
}

export const postPaperByUid = async (req: NextApiRequest, res: NextApiResponse<{data: boolean}>) => {
  try {
    const paperRef = doc(db, `papers/${req.query.uid}`);
    const paperSnap = await getDoc(paperRef);
    if (!paperSnap.exists()) throw "Document does not exist!";
    const posts = paperSnap.data().posts as PostData[];
    const targetPost = posts.find(({key}) => key === req.body.key) as PostData;
    if (targetPost) {
      const updatePost = posts.map((post) => 
        (post.key === req.body.key) ? {...post, name: req.body.name, message: req.body.message, updateDate: req.body.updateDate} : {...post}
      )
      await updateDoc(paperRef, { posts: [...updatePost] });
    } else {
      posts.push({
        key: req.body.key,
        name: req.body.name,
        message: req.body.message,
        initDate: req.body.initDate,
        updateDate: req.body.updateDate
      });
      await updateDoc(paperRef, {
        posts: [...posts]
      });
    }
    return res.json({data: true});
  } catch (e) {
    return res.status(401).json({data: false});
  }
}
// async function insertPaperData(uid: string) {
//   const paperData = {
//     userId: user.id,
//     userName: user.name,
//     friendName: req.body.name,
//     friendBirth: req.body.birthDate,
//     completedUid: '',
//     isCompleted: false,
//     posts: [],
//   };
//   await setDoc(doc(db, `papers/${uid}`), paperData);
//   return paperData;
// }
// async function updateUserPapers(uid: string) {
//   const userRef = doc(db, `users/${user.id}`);
//   const userDoc = await getDoc(userRef);
//   if (!userDoc.exists()) throw "Document does not exist!"; // 존재하지 않는 문서
//   const userPapers = userDoc.data().papers as string[] ?? [];
//   await updateDoc(userRef, { papers: [...userPapers, uid] });
// }
