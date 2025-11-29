import { Router } from "express";
import { getProtectedData } from "../controllers/test.controller.js";
import { sessionMiddleware } from "../middleware/auth.middleware.js";

const router: Router = Router();

router.get("/protected", sessionMiddleware, getProtectedData);

export default router;
