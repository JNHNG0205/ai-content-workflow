import { Router } from "express";
import * as aiController from "../controllers/ai.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { Role } from "../generated/prisma";

const router = Router();

// Generate content using AI
router.post('/generate', authMiddleware(Role.WRITER), aiController.generateContent);

export default router;

