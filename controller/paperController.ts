import { deleteDoc, doc, getDoc, runTransaction, setDoc, updateDoc } from "firebase/firestore";
import { db } from "lib/firebase-client";
import { nanoid } from "nanoid";
import { NextApiRequest, NextApiResponse } from "next";
import { Session } from "next-auth";
import { getSession } from "next-auth/react";
import { CreatePaperInput } from "pages/api/paper";
import { PaperPostData } from "pages/api/paper/[uid]";

// 롤링페이퍼 생성
export const createPaper = async (
  req: NextApiRequest, 
  res: NextApiResponse<StorePaperData | null>,
  body: CreatePaperInput
) => {
  const session = await getSession({req});
  const user = session?.user as UserSession;
  try {
    const data = await runTransaction(db, async (transaction) => {
      const uid = nanoid();
      const paperData = {
        userId: user.id,
        userName: user.name,
        friendName: body.name,
        friendBirth: new Date(body.birthDate),
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
      return { ...paperData, uid } as any;
    });
    return res.json({...data});
  } catch (e) {
    return res.json(null);
  }
}

// 롤링페이퍼 재생성(재발급)
export const newCreatePaper = async (
  req: NextApiRequest, 
  res: NextApiResponse<{uid: string}|null>,
  body: {uid: string}
) => {
  const session = await getSession({req});
  const user = session?.user as UserSession;
  if (!session) throw 'Permission Denied';
  else {
    try {
      const data = await runTransaction(db, async (transaction) => {
        const paperDocRef = doc(db, `papers/${body.uid}`);
        const userDocRef = doc(db, `users/${user.id}`);
        const paperDoc = await transaction.get(paperDocRef);
        const userDoc = await transaction.get(userDocRef);
        if (!userDoc.exists() ||!paperDoc.exists()) throw "Document does not exist!";
        const newUid = nanoid();
        const paperData = paperDoc.data() as StorePaperData;
        const userPapers = userDoc.data().papers;
        const updateUserPapers = userPapers.filter((paperUid: string) => paperUid !== body.uid);
        await transaction.update(userDocRef, { papers: [...updateUserPapers, newUid] });
        await transaction.set(doc(db, `papers/${newUid}`), paperData);
        await transaction.delete(doc(db, `papers/${body.uid}`));
        return { uid: newUid };
      });
      return res.json({...data});
    } catch(e) {
      return res.json(null);
    }
  }
}

// 롤링페이퍼 데이터 가져오기
export const getPaperByUid = async (req: NextApiRequest, res: NextApiResponse<{paper: PaperData|null}>) => {
  const paperDocRef = doc(db, `papers/${req.query.uid}`);
  const paperDoc = await getDoc(paperDocRef);
  const paperData = paperDoc.data() as StorePaperData;
  if (paperData) return res.json({paper: {...paperData, friendBirth: (paperData.friendBirth as any).toDate()}}); 
  else return res.json({paper: null});
}

// 롤링페이퍼 삭제
export const deletePaperByUid = async (req: NextApiRequest, res: NextApiResponse<{data: boolean}>) => {
  const session = await getSession({req});
  const user = session?.user as UserSession;
  if (!session) throw 'Permission Denied';
  else {
    try {
      const userDocRef = doc(db, `users/${user.id}`);
      const userDoc = await getDoc(userDocRef);
      if (!userDoc.exists()) throw "Document does not exist!";
      await deleteDoc(doc(db, `papers/${req.query.uid}`));
      const userPapers = userDoc.data().papers;
      const updateUserPapers = userPapers.filter((paperUid: string) => paperUid !== req.query.uid);
      await updateDoc(userDocRef, {
        papers: updateUserPapers
      });
      return res.json({data: true});
    } catch(e) {
      return res.json({data: false});
    }
  }
}

// 롤링페이퍼 포스트 메시시 저장
export const postPaperByUid = async (
  req: NextApiRequest,
  res: NextApiResponse<{data: boolean}>,
  body: PaperPostData
) => {
  try {
    const paperRef = doc(db, `papers/${req.query.uid}`);
    const paperSnap = await getDoc(paperRef);
    if (!paperSnap.exists()) throw "Document does not exist!";
    const posts = paperSnap.data().posts as PostData[];
    const targetPost = posts.findIndex(({key}) => key === body.key);
    if (targetPost === -1) {
      posts.push({
        key: body.key,
        name: body.name,
        message: body.message,
        initDate: body.initDate as Date,
        updateDate: body.updateDate
      });
      await updateDoc(paperRef, { posts: [...posts] });
    } else {
      const updatePost = posts.map((post) => 
        (post.key === req.body.key) 
        ? {...post, name: req.body.name, message: req.body.message, updateDate: req.body.updateDate} 
        : post
      );
      await updateDoc(paperRef, { posts: [...updatePost] });
    }
    return res.json({data: true});
  } catch (e) {
    return res.json({data: false});
  }
}
