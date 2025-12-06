import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(req: Request) {
    try {
        const { message, context } = await req.json();

        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

        // context can include recent meal analysis or user profile if available
        const prompt = `
      You are PlateX Assistant, an expert AI nutritionist and health coach.
      
      User Context: ${JSON.stringify(context || {})}
      
      User Question: "${message}"
      
      Answer concise, encouraging, and scientifically accurate. 
      If the user asks about their recent meal, specifically refer to the context provided.
      Keep answers under 3 sentences unless asked for a detailed plan.
      Use emojis to be friendly.
    `;

        const result = await model.generateContent(prompt);
        const response = result.response.text();

        return NextResponse.json({ reply: response });

    } catch (error) {
        console.error("Chat error:", error);
        return NextResponse.json({ error: "Failed to get response" }, { status: 500 });
    }
}
