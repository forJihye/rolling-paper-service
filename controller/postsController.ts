import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "lib/firebase-client";
import { NextApiRequest, NextApiResponse } from "next";

export const deletePosts = async (req: NextApiRequest, res: NextApiResponse<{data: any}>) => {
  try {
    const paperDocRef = doc(db, `papers/${req.query.uid}`);
    const paperDoc = await getDoc(paperDocRef);
    if (!paperDoc.exists()) throw "Document does not exist!";
    const posts = paperDoc.data().posts as PostData[];
    const updatePosts = posts.filter(({key}) => !req.body.posts.includes(key));
    updateDoc(paperDocRef, { posts: updatePosts });
    return res.status(200).json({data: updatePosts});
  } catch(e) {
    console.log(e)
    return res.status(401).json({data: null});
  }
}