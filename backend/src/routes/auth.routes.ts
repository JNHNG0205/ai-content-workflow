// routes for authentication

import { Router } from "express";
import * as authController from "../controllers/auth.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { Role } from "../generated/prisma";

const router = Router();

router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/me', authMiddleware(Role.WRITER, Role.REVIEWER, Role.ADMIN), authController.getCurrentUser);

export default router;