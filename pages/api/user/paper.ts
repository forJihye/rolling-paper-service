import type { NextApiRequest, NextApiResponse } from 'next'
import { Body, createHandler, Get, Put, Req, Res } from '@storyofams/next-api-decorators';
import { getUserPapers } from 'controller/userController';
import { getSession } from 'next-auth/react';
import { Session } from 'next-auth';

class MyPaperHandler {
  @Get()
  async papers(@Req() req: NextApiRequest, @Res() res: NextApiResponse) {
    const session = await getSession({req});
    const user = session?.user as Session;
    if (!session) throw 'Permission Denied';
    return await getUserPapers(req, res, user);
  }
}

export default createHandler(MyPaperHandler);

