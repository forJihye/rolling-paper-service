// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react';
import { getUserPapers } from 'controller/userController';
import { Session } from 'next-auth';

export default async function handler( req: NextApiRequest, res: NextApiResponse<any> ) {
  const session = await getSession({req});
  const user = session?.user as Session;
  if (!session) throw 'Permission Denied';
  else {
    if (req.method === 'GET') { // 유저가 만든 모든 롤링페이퍼 가져오기
      return await getUserPapers(req, res, user)
    } 
  } 
}
