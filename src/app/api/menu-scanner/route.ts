
import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: NextRequest) {
    try {
        const { menuText, userGoals } = await req.json();

        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = `
      You are a Nutritionist AI. Analyze this restaurant menu text based on the user's goals.
      
      User Goals: ${JSON.stringify(userGoals)}
      Menu Text: "${menuText.substring(0, 1000)}..." (truncated)

      Return a JSON object:
      {
        "recommended_items": [
          { "name": "Item Name", "reason": "High protein, fits macros", "match_score": 95 }
        ],
        "avoid_items": [
           { "name": "Item Name", "reason": "High sugar/fried", "warning_level": "high" }
        ]
      }
    `;

        const result = await model.generateContent(prompt);
        const text = result.response.text();

        // Clean JSON
        const jsonStr = text.replace(/```json/g, '').replace(/```/g, '').trim();

        return NextResponse.json(JSON.parse(jsonStr));
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Menu analysis failed' }, { status: 500 });
    }
}
