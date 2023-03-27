// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { createPaper, deletePapers, newCreatePaper } from 'controller/paperController';
import { Body, createHandler, Delete, Get, Post, Put, Req, Res } from 'next-api-decorators';

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
  @Delete()
  async paperDelete(@Req() req: NextApiRequest, @Res() res: NextApiResponse) {
    return await deletePapers(req, res)
  }
}
export default createHandler(PaperMainHandler);
