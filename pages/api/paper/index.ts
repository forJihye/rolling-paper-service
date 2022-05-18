// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { Session } from 'next-auth';
import { getSession } from 'next-auth/react';
import { createPaper } from 'controller/paperController';
import { Body, createHandler, Get, Req, Res } from '@storyofams/next-api-decorators';

type CreatePaperInput = {
  name: string;
  birthDate: string;
}

class PaperMainHandler {
  @Get()
  async papers(@Req() req: NextApiRequest, @Res() res: NextApiResponse, @Body() body: CreatePaperInput) {
    return await createPaper(req, res);
  }
}

export default createHandler(PaperMainHandler);

// export default async function handler( req: NextApiRequest, res: NextApiResponse<any> ) {
//   const session = await getSession({req});
//   const user = session?.user as Session;
//   if (!session) {
//     throw 'Permission Denied';
//   } else {
//     if (req.method === "PUT") { // 롤링페이퍼 생성
//       return await createPaper(req, res, user);
//     }
//   } 
// }
