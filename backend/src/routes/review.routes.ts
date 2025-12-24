import { Router } from "express";
import * as reviewController from "../controllers/review.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { Role } from "../generated/prisma";

const router = Router();

router.get('/', authMiddleware(Role.REVIEWER), reviewController.getPendingReviews);
router.put('/:contentId/approve', authMiddleware(Role.REVIEWER), reviewController.approveContent);
router.put('/:contentId/reject', authMiddleware(Role.REVIEWER), reviewController.rejectContent);

export default router;