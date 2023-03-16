import { doc, getDoc } from "firebase/firestore";
import { db } from "lib/firebase-client";
import { NextApiRequest, NextApiResponse } from "next";

export const getUserPapers = async (req: NextApiRequest, res: NextApiResponse<{papers: PaperData[]|null}>, user: UserSession) => {
  try {
    const userDocRef = doc(db, `users/${user.id}`);
    const userDoc = await getDoc(userDocRef);
    if (!userDoc.exists()) throw "Document does not exist!";
    const userPapers = userDoc.data().papers ?? [];
    if (userPapers.length) {
      const data = userPapers.map(async (paperUid: string) => {
        const paperDocRef = doc(db, `papers/${paperUid}`);
        const paperDoc = await getDoc(paperDocRef);
        const paperDate = paperDoc.data() as PaperData;
        return { ...paperDate, uid: paperUid };
      });
      const result = await Promise.all(data);
      const papers = result.map(data => ({ ...data, friendBirth: data.friendBirth.toDate() }));
      return res.json({papers});
    } else {
      return res.json({papers: null});
    }
  } catch (e) {
    return res.json({papers: null});
  }
}