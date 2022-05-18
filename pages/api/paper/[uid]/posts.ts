import { deletePosts } from "controller/postsController";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler( req: NextApiRequest, res: NextApiResponse<any> ) {
  if (req.method === "GET") { 
  } 
  else if (req.method === 'DELETE') {
    return await deletePosts(req, res);
  }
  else if (req.method === "POST") {
  } 
}