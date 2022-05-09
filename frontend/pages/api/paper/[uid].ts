import { NextApiRequest, NextApiResponse } from "next";
import { deletePaperByUid, getPaperByUid, postPaperByUid } from "controller/paperController";

export default async function handler( req: NextApiRequest, res: NextApiResponse<any> ) {
  if (req.method === "GET") { // 롤링페이퍼 데이터 가져오기
    return await getPaperByUid(req, res);
  } 
  else if (req.method === 'DELETE') { // 롤링페이퍼 삭제
    return await deletePaperByUid(req, res);
  }
  else if (req.method === "POST") { // 메시지 등록
    return await postPaperByUid(req, res)
  } 
}