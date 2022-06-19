// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { createPaper, newCreatePaper } from 'controller/paperController';
import { Body, createHandler, Get, Post, Put, Req, Res } from '@storyofams/next-api-decorators';

export type CreatePaperInput = {
  name: string;
  birthDate: Date;
}

class PaperMainHandler {
  @Put()
  async papers(@Req() req: NextApiRequest, @Res() res: NextApiResponse, @Body() body: CreatePaperInput) {
    return await createPaper(req, res, body);
  }

  @Post()
  async newPaper(@Req() req: NextApiRequest, @Res() res: NextApiResponse, @Body() body: {uid: string}) {
    return await newCreatePaper(req, res, body);
  }
}
export default createHandler(PaperMainHandler);
