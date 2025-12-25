import dotenv from "dotenv";
dotenv.config();

import { generateContent } from "./services/ai.service";

async function testAI() {
    try {
        console.log("Testing AI service...");
        console.log("API Key present:", !!process.env.GEMINI_API_KEY);
        
        const prompt = "Write a short blog post about the benefits of TypeScript (2-3 sentences)";
        console.log("\nPrompt:", prompt);
        console.log("\nGenerating content...\n");
        
        const result = await generateContent(prompt);
        console.log("Result:", result);
        console.log("\n✅ Test successful!");
    } catch (error: any) {
        console.error("❌ Test failed:");
        console.error("Error:", error.message);
        console.error("Stack:", error.stack);
        
        if (error.message.includes("API key")) {
            console.error("\n💡 Make sure GEMINI_API_KEY is set in your .env file");
        }
    }
}

testAI();

