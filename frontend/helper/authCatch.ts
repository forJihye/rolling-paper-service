import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";

export const authCatch = (f: (req: NextApiRequest, res: NextApiResponse<any>, user: User) => void) => async (req: NextApiRequest, res: NextApiResponse<any>) => {
  const session = await getSession({req});
  const user = session?.user as User;
  if (!session) {
    return res.status(401).json({ error: 'Permission Denied' });
  } else {
    return await f(req, res, user)
  }
}