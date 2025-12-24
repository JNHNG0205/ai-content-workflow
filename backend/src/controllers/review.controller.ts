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

export async function reviewContent(req: Request, res: Response) {
    try {
        const {contentId} = req.params;
        const reviewerId = req.user?.id;
        if (!reviewerId) {
            return res.status(401).json({error: "Unauthorized"});
        }
        const result = await reviewService.reviewContent(contentId, reviewerId);
        return res.status(200).json(result);
    } catch (err: any) {
        console.error("Error in reviewContent:", err);
        if (err.code === 'P2025') {
            return res.status(404).json({error: "Content not found or not in SUBMITTED status"});
        }
        return res.status(500).json({error: "Internal server error"});
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
        console.error("Error in approveContent:", err);
        if (err.code === 'P2025') {
            return res.status(404).json({error: "Content not found, not in SUBMITTED status, or not assigned to reviewer"});
        }
        return res.status(500).json({error: "Internal server error"});
    }
}

export async function rejectContent(req: Request, res: Response) {
    try {
        const {contentId} = req.params;
        const {comment} = req.body;
        const reviewerId = req.user?.id;
        if (!reviewerId) {
            return res.status(401).json({error: "Unauthorized"});
        }
        const result = await reviewService.rejectContent(contentId, reviewerId, comment);
        return res.status(200).json(result);
    } catch (err: any) {
        console.error("Error in rejectContent:", err);
        if (err.code === 'P2025') {
            return res.status(404).json({error: "Content not found, not in SUBMITTED status, or not assigned to reviewer"});
        }
        return res.status(500).json({error: "Internal server error"});
    }
}

export async function getReviewedContent(req: Request, res: Response) {
    try {
        const reviewerId = req.user?.id;
        if (!reviewerId) {
            return res.status(401).json({error: "Unauthorized"});
        }
        const result = await reviewService.getReviewedContent(reviewerId);
        return res.status(200).json(result);
    } catch (err: any) {
        return res.status(500).json({error: "Internal server error"});
    }
}