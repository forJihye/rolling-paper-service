import { NextApiRequest, NextApiResponse } from "next";
import { deleteDoc, doc, getDoc, runTransaction, updateDoc } from "firebase/firestore";
import { db } from "firebaseClient";
import { getSession } from "next-auth/react";

export default async function handler( req: NextApiRequest, res: NextApiResponse<any> ) {
  if (req.method === "GET") { // 롤링페이퍼 데이터 가져오기
    const paperDocRef = doc(db, `papers/${req.query.uid}`);
    const paperDoc = await getDoc(paperDocRef);
    const paperData = paperDoc.data() as PaperData;
    return res.json({paper: paperData}); 
  } 
  else if (req.method === 'DELETE') { // 롤링페이퍼 삭제
    const session = await getSession({req});
    const user = session?.user as User;
    if (!session) {
      return res.status(401).json({ error: 'Permission Denied' });
    } else {
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
  else if (req.method === "POST") { // 메시지 등록
    try {
      const paperRef = doc(db, `papers/${req.query.uid}`);
      const paperSnap = await getDoc(paperRef);
      if (!paperSnap.exists()) { // 존재하지 않는 문서
        throw "Document does not exist!";
      }
      const posts = paperSnap.data().posts as PostData[];
      const targetPost = posts.filter(({key}) => key === req.body.key);
      if (targetPost.length) {
        const updatePost = posts.map((post) => {
          return (post.key === req.body.key) ? {...post, name: req.body.name, message: req.body.message} : {...post}
        })
        await updateDoc(paperRef, {
          posts: [...updatePost]
        });
      } else {
        posts.push({
          key: req.body.key,
          name: req.body.name,
          message: req.body.message
        });
        await updateDoc(paperRef, {
          posts: [...posts]
        });
      }
      return res.status(200).json({data: true});
    } catch (e) {
      return res.status(401).json({data: null});
    }
  } 
}