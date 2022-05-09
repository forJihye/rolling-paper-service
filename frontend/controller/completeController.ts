import { collection, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "firebaseClient";
import { NextApiRequest, NextApiResponse } from "next";
import { v4 as uuid } from 'uuid';

export const createPaperComplete = async (
  req: NextApiRequest,
  res: NextApiResponse<{data: null | {completedUid: string; isCompleted: boolean}}>
) => {
  try {
    const paperDocRef = doc(db, `papers/${req.body.uid}`);
    const paperDoc = await getDoc(paperDocRef);
    if (!paperDoc.exists()) { // 존재하지 않는 문서
      throw "Document does not exist!";
    }
    const paperData = paperDoc.data();
    const completedUid = uuid();
    updateDoc(paperDocRef, {
      completedUid,
      isCompleted: true
    });
    // 완성 롤릴페이퍼 컬렉션 생성
    const completeRef = collection(db, `complete`);
    const completeDoc = doc(completeRef, completedUid);
    setDoc(completeDoc, {
      posts: [...paperData.posts],
      isCompleted: true
    });
    return res.json({ data: {completedUid, isCompleted: true} });
  } catch (e) {
    return res.status(401).json({data: null});
  }
}

export const getCompletedPaper = async (
  req: NextApiRequest, 
  res: NextApiResponse<{data: null|CompletedPaper}>
) => {
  const docRef = doc(db, `complete/${req.query.uid}`);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data() as CompletedPaper;
      return res.status(200).json({data});
    } else {
      return res.status(401).json({data: null});
    }
}