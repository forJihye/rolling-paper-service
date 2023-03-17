import type { NextApiRequest, NextApiResponse } from 'next'
import { Body, createHandler, Get, Put, Req, Res } from 'next-api-decorators';
import { getUserPapers } from 'controller/userController';
import { getSession } from 'next-auth/react';

class MyPaperHandler {
  @Get()
  async papers(@Req() req: NextApiRequest, @Res() res: NextApiResponse) {
    const session = await getSession({req}) as UserSession;
    if (!session) throw 'Permission Denied';
    return await getUserPapers(req, res, session);
  }
}

export default createHandler(MyPaperHandler);

