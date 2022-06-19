import { NextApiRequest, NextApiResponse } from "next";
import { deletePaperByUid, getPaperByUid, postPaperByUid } from "controller/paperController";
import { Body, createHandler, Delete, Get, Post, Put, Req, Res } from '@storyofams/next-api-decorators';

export type PaperPostData = {
  key: string;
  name: string;
  message: string;
  updateDate: Date;
  initDate?: Date;
}

class PaperPostHandler {
  @Get()
  async paper(@Req() req: NextApiRequest, @Res() res: NextApiResponse) {  // 롤링페이퍼 데이터 가져오기
    return await getPaperByUid(req, res);
  }
  @Post()
  async paperPost(@Req() req: NextApiRequest, @Res() res: NextApiResponse, @Body() body: PaperPostData) { // 롤링페이퍼 삭제
    return await postPaperByUid(req, res, body)
  }
  @Delete()
  async paperDelete(@Req() req: NextApiRequest, @Res() res: NextApiResponse) { // 메시지 등록
    return await deletePaperByUid(req, res)
  }
}

export default createHandler(PaperPostHandler);
