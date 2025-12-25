import { Request, Response } from "express";
import * as aiService from "../services/ai.service";

export async function generateContent(req: Request, res: Response) {
    try {
        const { prompt } = req.body;
        
        if (!prompt || typeof prompt !== "string") {
            return res.status(400).json({ error: "Prompt is required and must be a string" });
        }

        if (prompt.trim().length === 0) {
            return res.status(400).json({ error: "Prompt cannot be empty" });
        }

        const result = await aiService.generateContent(prompt);
        return res.status(200).json({ content: result });
    } catch (err: any) {
        console.error("Error in generateContent:", err);
        
        if (err.message.includes("GEMINI_API_KEY")) {
            return res.status(500).json({ error: "AI service is not configured. Please contact administrator." });
        }
        
        return res.status(500).json({ error: err.message || "Failed to generate content" });
    }
}

