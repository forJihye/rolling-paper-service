import { Body, Catch, createHandler, Delete, Get, Post, Req, Res } from 'next-api-decorators';
import { NextApiRequest, NextApiResponse } from "next";
import { getPaperByUid, postPaperByUid } from "controller/paperController";

function exceptionHandler(
  error: unknown,
  req: NextApiRequest,
  res: NextApiResponse
) {
  const message = error instanceof Error ? error.message : 'An unknown error occurred.';
  res.status(200).json({ success: false, error: message });
}


export type PaperPostData = {
  key: string;
  name: string;
  message: string;
  updateDate: Date;
  initDate?: Date;
}

@Catch(exceptionHandler)
class PaperPostHandler {
  @Get()
  async paper(@Req() req: NextApiRequest, @Res() res: NextApiResponse) {  // 롤링페이퍼 데이터 가져오기
    return await getPaperByUid(req, res);
  }
  @Post() 
  async paperPost(@Req() req: NextApiRequest, @Res() res: NextApiResponse, @Body() body: PaperPostData) { // 롤링페이퍼 등록
    return await postPaperByUid(req, res, body)
  }
}

export default createHandler(PaperPostHandler);
