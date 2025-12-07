import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(req: Request) {
    try {
        const { text } = await req.json();

        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });

        const prompt = `
      Analyze this food description: "${text}"
      Return a JSON object with: 
      - food_name (string)
      - total_calories (number)
      - total_protein (number)
      - total_carbs (number)
      - total_fat (number)
      - health_score (1-100 number)
      - glycemic_load (Low/Medium/High)
      - ingredients (array of strings, breakdown of what's in it)
      - warnings (array of strings if any unhealthy additives/high sugar)

      Return ONLY JSON. No markdown formatting.
    `;

        const result = await model.generateContent(prompt);
        let responseText = result.response.text();

        // Clean markdown if present
        if (responseText.startsWith('```json')) {
            responseText = responseText.replace(/```json/g, '').replace(/```/g, '');
        }

        const data = JSON.parse(responseText);

        // Mock image for voice logs (or use a placeholder)
        data.image_url = null;

        return NextResponse.json(data);

    } catch (error) {
        console.error("Voice log error:", error);
        return NextResponse.json({ error: "Failed to analyze text" }, { status: 500 });
    }
}
