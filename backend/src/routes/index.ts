import { Router } from "express";
import authRoutes from "./auth.routes";
import healthRoutes from "./health";

const router = Router();

router.use('/auth', authRoutes);

router.use('/health', healthRoutes);
export default router;