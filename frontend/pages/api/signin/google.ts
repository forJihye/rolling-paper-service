import { NextApiRequest, NextApiResponse } from 'next';

// http://localhost:3000/oauth2/redirect/google
// try {
//   res.status(200).send({ done: true })
// } catch (error: any) {
//   res.status(500).end(error.message)
// }

export default async function google(req: NextApiRequest, res: NextApiResponse) {
  res.status(200).send({done: true})
}
