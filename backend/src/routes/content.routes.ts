import { Router } from "express";
import * as contentController from "../controllers/content.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { Role } from "../generated/prisma";

const router = Router();

// Create new draft
router.post('/', authMiddleware(Role.WRITER), contentController.createDraft);

// Get content lists (must be before /:contentId routes)
router.get('/drafts', authMiddleware(Role.WRITER), contentController.getMyDrafts);
router.get('/submitted', authMiddleware(Role.WRITER), contentController.getSubmittedContent);
router.get('/rejected', authMiddleware(Role.WRITER), contentController.getRejectedContent);
router.get('/approved', authMiddleware(Role.WRITER), contentController.getApprovedContent);

// Get single content by ID
router.get('/:contentId', authMiddleware(Role.WRITER), contentController.getContentById);

// Update content (must be before action routes)
router.put('/:contentId', authMiddleware(Role.WRITER), contentController.updateContent);

// Content actions
router.post('/:contentId/submit', authMiddleware(Role.WRITER), contentController.submitDraft);
router.put('/:contentId/revert', authMiddleware(Role.WRITER), contentController.editRejectedContent);

export default router;