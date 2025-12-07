import Groq from "groq-sdk";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const apiKey = process.env.GROQ_API_KEY;

        if (!apiKey) {
            console.error("GROQ_API_KEY is not set");
            return NextResponse.json({ error: "API key not configured" }, { status: 500 });
        }

        const groq = new Groq({ apiKey });
        const { ingredients } = await req.json();

        if (!ingredients || !Array.isArray(ingredients) || ingredients.length === 0) {
            return NextResponse.json({ error: "Invalid ingredients list" }, { status: 400 });
        }

        const prompt = `You are an expert chef and nutritionist.
Suggest ONE healthy, delicious recipe that can be made primarily using these ingredients: ${ingredients.join(', ')}.
You can add common pantry staples (oil, salt, spices, basic veggies).

Return ONLY valid JSON with this structure (no markdown, no code blocks, just raw JSON):
{
  "name": "Recipe Name",
  "description": "Brief tempting description",
  "time": "35 mins",
  "calories": 450,
  "ingredients": ["1 cup rice", "200g chicken"],
  "instructions": "Step 1: Do this. Step 2: Do that. Step 3: Serve hot."
}`;

        const completion = await groq.chat.completions.create({
            messages: [
                {
                    role: "user",
                    content: prompt,
                },
            ],
            model: "llama-3.3-70b-versatile",
            temperature: 0.7,
            max_tokens: 1024,
        });

        const text = completion.choices[0]?.message?.content || "";

        // Cleanup potential markdown formatting
        const cleanedText = text.replace(/```json/g, '').replace(/```/g, '').trim();

        console.log("Recipe API response:", cleanedText);

        const recipe = JSON.parse(cleanedText);

        return NextResponse.json({ recipe });

    } catch (error: any) {
        console.error("Recipe generation error:", error?.message || error);
        return NextResponse.json({ error: "Failed to generate recipe", details: error?.message }, { status: 500 });
    }
}
