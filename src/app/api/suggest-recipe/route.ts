import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(req: Request) {
    try {
        const { ingredients } = await req.json();

        if (!ingredients || !Array.isArray(ingredients)) {
            return NextResponse.json({ error: "Invalid ingredients list" }, { status: 400 });
        }

        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = `
      You are an expert chef and nutritionist.
      Suggest ONE healthy, delicious recipe that can be made primarily using these ingredients: ${ingredients.join(', ')}.
      You can add common pantry staples (oil, salt, spices, basic veggies).
      
      Return ONLY valid JSON with this structure:
      {
        "name": "Recipe Name",
        "description": "Brief tempting description",
        "prep_time": "15 mins",
        "cook_time": "20 mins",
        "calories": 450,
        "ingredients": ["1 cup rice", "200g chicken", ...],
        "instructions": ["Step 1...", "Step 2..."]
      }
      Do not wrap in markdown or code blocks. Just raw JSON.
    `;

        const result = await model.generateContent(prompt);
        const text = result.response.text();

        // Cleanup potential markdown formatting
        const cleanedText = text.replace(/```json/g, '').replace(/```/g, '').trim();

        const recipe = JSON.parse(cleanedText);

        return NextResponse.json(recipe);

    } catch (error) {
        console.error("Recipe generation error:", error);
        return NextResponse.json({ error: "Failed to generate recipe" }, { status: 500 });
    }
}
