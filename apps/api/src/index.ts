import cors from "cors";
import dotenv from "dotenv";
import express from "express";

import { auth } from "@repo/auth";
import { toNodeHandler } from "better-auth/node";

dotenv.config();

const app = express();
const port = process.env.API_PORT || 3001;

app.use(cors({
    origin: ["http://localhost:3000", process.env.NEXT_PUBLIC_APP_URL || ""],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
}));

app.use(express.json());

app.all("/api/auth/*path", toNodeHandler(auth));

const sessionMiddleware = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
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

app.get("/api/protected", sessionMiddleware, (req, res) => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore - session is attached in middleware
  res.json({ message: "This is a protected route", session: req.session });
});

app.get("/", (req, res) => {
  res.send("API is running");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
