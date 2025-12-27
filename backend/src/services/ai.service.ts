import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY || "",
});

// AI Character/Persona Setting
const AI_CHARACTER = `You are a professional social media marketing expert with years of experience in creating engaging, high-converting content. You understand audience psychology, platform best practices, and the art of storytelling. Your content is always clear, compelling, and optimized for maximum engagement. You write in a tone that is professional yet approachable, and you know how to craft messages that resonate with diverse audiences.

IMPORTANT: When generating content, return ONLY the social media post text with emojis. Do not include explanations, introductions, or any meta-commentary. Just return the post content itself, formatted like a typical social media post.`;

function buildPromptWithCharacter(userPrompt: string): string {
    return `${AI_CHARACTER}\n\n${userPrompt}\n\nRemember: Return ONLY the post text/emojis, nothing else.`;
}

function extractPostText(response: any): string {
    let text = '';
    
    // Handle different response formats
    if (typeof response.text === "string") {
        text = response.text;
    } else if (response && typeof response === "object") {
        text = (response as any).text || (response as any).content || JSON.stringify(response);
    } else {
        text = String(response);
    }
    
    // Clean up the text - remove common AI response patterns
    // Remove things like "Here's your post:", "Post:", etc.
    const lines = text.split('\n');
    const cleanedLines: string[] = [];
    let foundPostStart = false;
    
    for (const line of lines) {
        const lowerLine = line.toLowerCase().trim();
        // Skip common AI introduction patterns
        if (lowerLine.includes('here\'s') || 
            lowerLine.includes('here is') ||
            lowerLine.startsWith('post:') ||
            lowerLine.startsWith('content:') ||
            lowerLine.startsWith('social media post:') ||
            (lowerLine.length < 3 && !foundPostStart)) {
            continue;
        }
        foundPostStart = true;
        cleanedLines.push(line);
    }
    
    const cleaned = cleanedLines.join('\n').trim();
    
    // If cleaned text is empty or too short, return original
    if (cleaned.length < 10) {
        return text.trim();
    }
    
    return cleaned;
}

export async function generateContent(prompt: string) {
    if (!process.env.GEMINI_API_KEY) {
        throw new Error("GEMINI_API_KEY is not set in environment variables");
    }

    try {
        const promptWithCharacter = buildPromptWithCharacter(prompt);
        const response = await ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: promptWithCharacter,
        });
        
        // Extract and clean the post text
        return extractPostText(response);
        
    } catch (error: any) {
        console.error("AI Service Error:", error);
        throw new Error(`Failed to generate content: ${error.message}`);
    }
}

export async function refineContent(currentContent: string, instruction?: string) {
    if (!process.env.GEMINI_API_KEY) {
        throw new Error("GEMINI_API_KEY is not set in environment variables");
    }

    if (!currentContent || currentContent.trim().length === 0) {
        throw new Error("Content is required for refinement");
    }

    try {
        const refinePrompt = instruction 
            ? `Refine and improve the following social media post based on this instruction: "${instruction}". Here is the current post:\n\n${currentContent}\n\nReturn ONLY the improved post text with emojis, nothing else.`
            : `Refine and improve the following social media post. Make it more engaging, clear, and well-structured while maintaining the original meaning and intent. Here is the current post:\n\n${currentContent}\n\nReturn ONLY the improved post text with emojis, nothing else.`;

        const promptWithCharacter = buildPromptWithCharacter(refinePrompt);
        const response = await ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: promptWithCharacter,
        });
        
        // Extract and clean the post text
        return extractPostText(response);
        
    } catch (error: any) {
        console.error("AI Service Error:", error);
        throw new Error(`Failed to refine content: ${error.message}`);
    }
}

