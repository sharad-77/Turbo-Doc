import { auth } from "@repo/auth";
import { toNodeHandler } from "better-auth/node";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import testRoutes from "./routes/test.route.js";
import uploadRoutes from "./routes/upload.route.js";

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

app.use("/api", uploadRoutes);
app.use("/api", testRoutes);

app.get("/", (req, res) => {
  res.send("API is running");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
