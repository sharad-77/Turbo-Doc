import { Router } from "express";
import { createExample, getExample } from "../controllers/example.controller.js";

const router: Router = Router();

router.get("/", getExample);
router.post("/", createExample);

export default router;
