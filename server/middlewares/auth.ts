import type { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { userExists } from '../components/user/repository';

export function generateAccessToken(userId: number, username: string) {
  return jwt.sign({ userId, username }, process.env.TOKEN);
}

export function authenticateToken(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1]

  if (token == null) {
    res.sendStatus(401);
    return;
  }

  jwt.verify(token, process.env.TOKEN, async (err: any, user: any) => {
    console.log(err)

    if (err) {
      res.status(403).json({ err: "Unauthorized" });
      return;
    }
    console.log(`userId = ${user.userId}`);
    const result = await userExists(user.userId);

    if (result === undefined) {
      console.log("user not found");
      res.status(403).json("token valid but user not exsists");
      return;
    }
    req.user = user;
    next();
  })
}