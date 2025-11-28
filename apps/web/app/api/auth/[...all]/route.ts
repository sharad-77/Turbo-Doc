import { auth } from "@repo/auth";
import { toNextJsHandler } from "better-auth/next-js";

const handlers = toNextJsHandler(auth);

export const GET = async (req: Request) => {
  console.log("Auth GET route hit:", req.url);
  return handlers.GET(req);
};

export const POST = async (req: Request) => {
  console.log("Auth POST route hit:", req.url);
  return handlers.POST(req);
};
