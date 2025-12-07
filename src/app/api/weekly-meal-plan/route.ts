import Groq from "groq-sdk";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const apiKey = process.env.GROQ_API_KEY;

        if (!apiKey) {
            return NextResponse.json({ error: "API key not configured" }, { status: 500 });
        }

        const groq = new Groq({ apiKey });
        const { profile } = await req.json();

        const prompt = `Generate a 7-day meal plan for someone with these characteristics:
- Goal: ${profile?.goal || 'maintenance'}
- Diet preference: ${profile?.preference || 'omnivore'}
- Activity level: ${profile?.activityLevel || 'moderate'}

Return ONLY a valid JSON object with this structure:
{
  "Monday": {
    "breakfast": { "name": "Meal Name", "calories": 400 },
    "lunch": { "name": "Meal Name", "calories": 550 },
    "dinner": { "name": "Meal Name", "calories": 600 },
    "snack": { "name": "Snack Name", "calories": 200 }
  },
  "Tuesday": { ... },
  ... (continue for all 7 days)
}

Make meals varied, healthy, and practical. Match calories to the goal.
No markdown, no code blocks, just raw JSON.`;

        const completion = await groq.chat.completions.create({
            messages: [{ role: "user", content: prompt }],
            model: "llama-3.3-70b-versatile",
            temperature: 0.7,
            max_tokens: 2000,
        });

        const text = completion.choices[0]?.message?.content || "";
        const cleanedText = text.replace(/```json/g, '').replace(/```/g, '').trim();

        try {
            const plan = JSON.parse(cleanedText);
            return NextResponse.json({ plan });
        } catch {
            return NextResponse.json({ error: "Failed to parse meal plan" }, { status: 500 });
        }

    } catch (error: any) {
        console.error("Meal plan error:", error?.message || error);
        return NextResponse.json({ error: "Failed to generate meal plan" }, { status: 500 });
    }
}
