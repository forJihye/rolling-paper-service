// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { Session } from 'next-auth';
import { getSession } from 'next-auth/react';
import { createPaper } from 'controller/paperController';

export default async function handler( req: NextApiRequest, res: NextApiResponse<any> ) {
  const session = await getSession({req});
  const user = session?.user as Session;
  if (!session) {
    throw 'Permission Denied';
    // return res.status(401).json({ error: 'Permission Denied' });
  } else {
    if (req.method === "PUT") { // 롤링페이퍼 생성
      return await createPaper(req, res, user);
    }
  } 
}
