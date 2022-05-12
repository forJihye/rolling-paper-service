import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";

export default async (req: NextApiRequest, res: NextApiResponse<any>) => {
  const session = await getSession({ req })
  if (session) {
    res.send({user: session.user})
  } else {
    res.status(401).json({ error: 'Permission Denied' });
  }
}

