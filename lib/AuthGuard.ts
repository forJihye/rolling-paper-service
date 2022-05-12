import { createMiddlewareDecorator, NextFunction } from "@storyofams/next-api-decorators";
import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";

const SessionAuthGuard = createMiddlewareDecorator(
  async (req: NextApiRequest, res: NextApiResponse, next: NextFunction) => {
    const session = await getSession({req});
    if (!session) {
      throw 'Permission Denied';
    } else {
      next();
    }
  }
);

export default SessionAuthGuard;