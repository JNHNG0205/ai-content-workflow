import { Router } from "express";
import * as contentController from "../controllers/content.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { Role } from "../generated/prisma";

const router = Router();

router.post('/',authMiddleware(Role.WRITER), contentController.createDraft);
router.get('/', authMiddleware(Role.WRITER), contentController.getMyDrafts);
router.put('/:contentId', authMiddleware(Role.WRITER), contentController.submitDraft);
router.get('/submitted', authMiddleware(Role.WRITER), contentController.getSubmittedContent);
router.get('/rejected', authMiddleware(Role.WRITER), contentController.getRejectedContent);
router.get('/approved', authMiddleware(Role.WRITER), contentController.getApprovedContent);
router.put('/:contentId/edit', authMiddleware(Role.WRITER), contentController.editRejectedContent);
router.put('/:contentId', authMiddleware(Role.WRITER), contentController.updateContent);

export default router;