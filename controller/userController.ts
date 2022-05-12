import { doc, getDoc } from "firebase/firestore";
import { db } from "lib/firebase-client";
import { NextApiRequest, NextApiResponse } from "next";
import { Session } from "next-auth";

export const getUserPapers = async (req: NextApiRequest, res: NextApiResponse<{papers: PaperData[]|null}>, user: Session) => {
  try {
    const userDocRef = doc(db, `users/${user.id}`);
    const userDoc = await getDoc(userDocRef);
    if (!userDoc.exists()) throw "Document does not exist!";
    const userPapers = userDoc.data().papers ?? [];
    if (userPapers.length) {
      const data = userPapers.map(async (paperUid: string) => {
        const paperDocRef = doc(db, `papers/${paperUid}`);
        const paperDoc = await getDoc(paperDocRef);
        return { ...paperDoc.data(), uid: paperUid };
      });
      const result = await Promise.all(data);
      return res.status(200).json({papers: result});
    } else return res.status(200).json({papers: null});
  } catch (e) {
    return res.status(401).json({papers: null});
  }
}