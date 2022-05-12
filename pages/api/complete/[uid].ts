import { NextApiRequest, NextApiResponse } from "next";
import { getCompletedPaper } from "controller/completeController";

export default async function handler( req: NextApiRequest, res: NextApiResponse<{data: null | CompletedPaper}> ) {
  if (req.method === 'GET') {
    return await getCompletedPaper(req, res);
  }
}