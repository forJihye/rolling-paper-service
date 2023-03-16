import type { NextApiRequest, NextApiResponse } from 'next';
import { Body, createHandler, Delete, Get, Post, Put, Req, Res } from 'next-api-decorators';
import { deletePosts } from 'controller/postsController';

class PaperPostHandler {
  @Delete()
  async posts(@Req() req: NextApiRequest, @Res() res: NextApiResponse) {
    return await deletePosts(req, res);
  }
}
export default createHandler(PaperPostHandler);
