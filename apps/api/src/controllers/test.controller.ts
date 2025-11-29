import { Request, Response } from "express";

export const getProtectedData = (req: Request, res: Response) => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore - session is attached in middleware
  res.json({ message: "This is a protected route", session: req.session });
};
