import { Router } from "express";
import * as reviewController from "../controllers/review.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { Role } from "../generated/prisma";

const router = Router();

// Get pending reviews (must be before /:contentId routes)
router.get('/pending', authMiddleware(Role.REVIEWER), reviewController.getPendingReviews);
router.get('/reviewed', authMiddleware(Role.REVIEWER), reviewController.getReviewedContent);

// Review actions
router.post('/:contentId/assign', authMiddleware(Role.REVIEWER), reviewController.reviewContent);
router.post('/:contentId/approve', authMiddleware(Role.REVIEWER), reviewController.approveContent);
router.post('/:contentId/reject', authMiddleware(Role.REVIEWER), reviewController.rejectContent);

export default router;