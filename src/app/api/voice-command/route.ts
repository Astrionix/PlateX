
import { NextRequest, NextResponse } from 'next/server';
import Groq from 'groq-sdk';

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});

const SYSTEM_PROMPT = `
You are Jarvis, an advanced AI controller for PlateX (a nutrition app).
Your goal is to interpret user voice commands and return a structured JSON response.

AVAILABLE ACTIONS:
1. NAVIGATE - Go to a specific page.
   Pages: /dashboard, /meal-prep, /fridge (Clean Fridge), /profile, /progress, /social, /settings
2. LOG_FOOD - User wants to log food. Extract the food items.
3. QUERY_DATA - User asks about their stats (calories, protein, health score).
4. START_WORKFLOW - Complex multi-step actions (e.g., "Start cooking mode").
5. CHAT - General conversation.

RESPONSE FORMAT (JSON ONLY):
{
  "action": "NAVIGATE" | "LOG_FOOD" | "QUERY_DATA" | "START_WORKFLOW" | "CHAT",
  "payload": {
     "destination": "/path" (for NAVIGATE),
     "food_items": ["item1", "item2"] (for LOG_FOOD),
     "query_type": "calories" | "protein" | "weight" (for QUERY_DATA),
     "workflow": "chef_mode" (for START_WORKFLOW)
  },
  "speech_response": "Short, natural text for TTS to say."
}

EXAMPLES:
User: "Take me to my meal plan."
Response: {"action": "NAVIGATE", "payload": {"destination": "/meal-prep"}, "speech_response": "Opening your meal plan."}

User: "I ate a banana and two eggs."
Response: {"action": "LOG_FOOD", "payload": {"food_items": ["banana", "2 eggs"]}, "speech_response": "Logging a banana and two eggs."}

User: "How many calories have I eaten?"
Response: {"action": "QUERY_DATA", "payload": {"query_type": "calories"}, "speech_response": "Let me check your calorie intake."}

User: "Start cooking mode for this recipe."
Response: {"action": "START_WORKFLOW", "payload": {"workflow": "chef_mode"}, "speech_response": "Activating Chef Mode."}
`;

export async function POST(req: NextRequest) {
    try {
        const { transcript } = await req.json();

        if (!transcript) {
            return NextResponse.json({ error: 'No transcript provided' }, { status: 400 });
        }

        const completion = await groq.chat.completions.create({
            messages: [
                { role: 'system', content: SYSTEM_PROMPT },
                { role: 'user', content: transcript }
            ],
            model: 'llama3-70b-8192',
            temperature: 0.1,
            response_format: { type: 'json_object' }
        });

        const choice = completion.choices[0].message.content;
        const jsonResponse = JSON.parse(choice || '{}');

        return NextResponse.json(jsonResponse);
    } catch (error) {
        console.error('Jarvis Error:', error);
        return NextResponse.json({
            action: 'CHAT',
            payload: {},
            speech_response: "I'm having trouble connecting to the mainframe."
        }, { status: 500 });
    }
}
