import Groq from 'groq-sdk';
import { NextResponse } from 'next/server';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

export async function POST(req: Request) {
  try {
    const { profile } = await req.json();

    if (!profile) {
      return NextResponse.json({ error: 'Profile data is required' }, { status: 400 });
    }

    console.log('Received Profile for Groq:', profile);

    const prompt = `
      Act as a professional nutritionist. Create a personalized 1-day diet plan for a user with the following profile:
      - Age: ${profile.age}
      - Gender: ${profile.gender}
      - Height: ${profile.height} cm
      - Weight: ${profile.weight} kg
      - Activity Level: ${profile.activityLevel}
      - Goal: ${profile.goal}
      - Dietary Preference: ${profile.preference}

      Calculate their approximate TDEE and target calories for their goal.
      Provide the plan in strict JSON format with the following structure:
      {
        "target_calories": number,
        "target_macros": { "protein": "xg", "carbs": "xg", "fat": "xg" },
        "meals": [
          {
            "type": "Breakfast",
            "name": "Meal Name",
            "description": "Brief description of ingredients/prep",
            "calories": number,
            "protein": number,
            "carbs": number,
            "fat": number
          },
          { "type": "Lunch", ... },
          { "type": "Dinner", ... },
          { "type": "Snack", ... }
        ],
        "advice": "A short paragraph of advice for this specific user."
      }
      IMPORTANT: Return ONLY the raw JSON string. Do not include markdown formatting like \`\`\`json or any introductory text.
    `;

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are a helpful nutritionist API that outputs strictly valid JSON."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.5,
      max_tokens: 1024,
      top_p: 1,
      stream: false,
      response_format: { type: "json_object" }
    });

    const text = completion.choices[0]?.message?.content || "";
    console.log('Groq Raw Response:', text);

    try {
      const json = JSON.parse(text);
      return NextResponse.json(json);
    } catch (e) {
      console.error('JSON Parse Error:', e);
      // Fallback cleanup if JSON mode fails or adds extra text (unlikely with json_object mode but possible)
      const cleanedText = text.replace(/```json/g, '').replace(/```/g, '').trim();
      try {
        return NextResponse.json(JSON.parse(cleanedText));
      } catch (e2) {
        throw new Error('Invalid JSON response from Groq');
      }
    }

  } catch (error: any) {
    console.error('Error generating diet plan with Groq:', error);
    return NextResponse.json({ error: 'Failed to generate plan', details: error.message }, { status: 500 });
  }
}
