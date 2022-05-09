import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import { createPaperComplete } from "controller/completeController";

export default async function handler( req: NextApiRequest, res: NextApiResponse<any> ) {
  const session = await getSession({req});
  if (!session) throw 'Permission Denied' 
  else {
    if (req.method === "PUT") { // 롤링페이퍼 완성하기
      return await createPaperComplete(req, res);
    }
  }
}