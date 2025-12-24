import { Request, Response } from "express";
import * as contentService from "../services/content.service";

export async function createDraft(req: Request, res: Response) {
    try {
        const { title, body } = req.body;
        const authorId = req.user?.id;
        if (!authorId) {
            return res.status(401).json({ error: "Unauthorized" });
        }
        const result = await contentService.createDraft(title, body, authorId);
        return res.status(201).json(result);
    } catch (err: any) {
        return res.status(500).json({ error: "Internal server error" });
    }
}

export async function getMyDrafts(req: Request, res: Response) {
    try {
        const authorId = req.user?.id;
        if (!authorId) {
            return res.status(401).json({ error: "Unauthorized" });
        }
        const result = await contentService.getMyDrafts(authorId);
        return res.status(200).json(result);
    } catch (err: any) {
        return res.status(500).json({ error: "Internal server error" });
    }
}

export async function submitDraft(req: Request, res: Response) {
    try {
        const { contentId } = req.params;
        const authorId = req.user?.id;
        if (!authorId) {
            return res.status(401).json({ error: "Unauthorized" });
        }
        const result = await contentService.submitDraft(contentId, authorId);
        return res.status(200).json(result);
    } catch (err: any) {
        return res.status(500).json({ error: "Internal server error" });
    }
}