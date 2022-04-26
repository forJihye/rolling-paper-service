// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react';

type Data = {
  name?: string;
  error?: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const session = await getSession();
  if (session) {
    res.status(200).json({ name: session.user?.name as string });
  } else {
    res.status(401).json({ error: 'Permission Denied' });
  }
}
