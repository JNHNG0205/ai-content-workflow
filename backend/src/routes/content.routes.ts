import { Router } from "express";
import * as contentController from "../controllers/content.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { Role } from "../generated/prisma";

const router = Router();

router.post('/',authMiddleware(Role.WRITER), contentController.createDraft);
router.get('/', authMiddleware(Role.WRITER), contentController.getMyDrafts);
router.put('/:contentId', authMiddleware(Role.WRITER), contentController.submitDraft);

export default router;