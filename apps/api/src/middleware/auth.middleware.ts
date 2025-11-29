import { auth } from "@repo/auth";
import express from "express";

export const sessionMiddleware = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const headers = new Headers();
  for (const [key, value] of Object.entries(req.headers)) {
    if (typeof value === "string") {
      headers.append(key, value);
    } else if (Array.isArray(value)) {
      value.forEach((v) => headers.append(key, v));
    }
  }

  const session = await auth.api.getSession({
    headers,
  });
  if (!session) {
    res.status(401).send("Unauthorized");
    return;
  }
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore - attaching session to request
  req.session = session;
  next();
};
