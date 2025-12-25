import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY || "",
});

export async function generateContent(prompt: string) {
    if (!process.env.GEMINI_API_KEY) {
        throw new Error("GEMINI_API_KEY is not set in environment variables");
    }

    try {
        const response = await ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: prompt,
        });
        
        // Handle different response formats
        if (typeof response.text === "string") {
            return response.text;
        }
        
        // If response is an object, try to extract text
        if (response && typeof response === "object") {
            // Try common response patterns
            const text = (response as any).text || (response as any).content || JSON.stringify(response);
            return text;
        }
        
        return String(response);
    } catch (error: any) {
        console.error("AI Service Error:", error);
        throw new Error(`Failed to generate content: ${error.message}`);
    }
}

