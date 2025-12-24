import { Request, Response } from "express";
import * as reviewService from "../services/review.service";

export async function getPendingReviews(req: Request, res: Response) {
    try {
        const reviewerId = req.user?.id;
        if (!reviewerId) {
            return res.status(401).json({ error: "Unauthorized" });
        }
        const result = await reviewService.getPendingReviews();
        return res.status(200).json(result);
    } catch (err: any) {
        return res.status(500).json({ error: "Internal server error" });
    }
}

export async function approveContent(req: Request, res: Response) {
    try {
        const  {contentId} = req.params;
        const reviewerId = req.user?.id;
        if (!reviewerId) {
            return res.status(401).json({error: "Unauthorized"});
        }
        const result = await reviewService.approveContent(contentId, reviewerId);
        return res.status(200).json(result);
    } catch (err: any) {
        return res.status(500).json({error: "Internal server error"});
    }
}

export async function rejectContent(req: Request, res: Response) {
    try {
        const {contentId} = req.params;
        const reviewerId = req.user?.id;
        if (!reviewerId) {
            return res.status(401).json({error: "Unauthorized"});
        }
        const result = await reviewService.rejectContent(contentId, reviewerId);
        return res.status(200).json(result);
    } catch (err: any) {
        return res.status(500).json({error: "Internal server error"});
    }
}