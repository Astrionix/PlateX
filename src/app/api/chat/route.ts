import Groq from "groq-sdk";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const apiKey = process.env.GROQ_API_KEY;

        if (!apiKey) {
            return NextResponse.json({ error: "API key not configured" }, { status: 500 });
        }

        const groq = new Groq({ apiKey });
        const { message, history, context } = await req.json();

        if (!message) {
            return NextResponse.json({ error: "Message required" }, { status: 400 });
        }

        // Build context from user profile if provided
        let contextInfo = '';
        if (context?.profile) {
            const p = context.profile;
            contextInfo = `User profile: ${p.name || 'User'}, Goal: ${p.goal || 'general health'}, Diet: ${p.preference || 'no restrictions'}.`;
        }

        const systemPrompt = `You are PlateX AI, a friendly and knowledgeable nutrition assistant. You help users with:
- Diet and nutrition questions
- Calorie and macro calculations
- Meal suggestions based on their goals
- Explaining food analysis results
- Providing healthy eating tips
- Answering questions about their logged food history

${contextInfo}

Keep responses concise, helpful, and encouraging. Use emojis occasionally to be friendly.
If asked about something unrelated to nutrition/health/food, politely redirect to nutrition topics.`;

        // Handle both history formats (from ChatAssistant and AIChatAssistant)
        const historyMessages = (history || []).slice(-10).map((msg: any) => ({
            role: (msg.role || 'user') as "user" | "assistant",
            content: msg.content || msg.text || ''
        })).filter((m: any) => m.content);

        const messages = [
            { role: "system" as const, content: systemPrompt },
            ...historyMessages,
            { role: "user" as const, content: message }
        ];

        const completion = await groq.chat.completions.create({
            messages,
            model: "llama-3.3-70b-versatile",
            temperature: 0.7,
            max_tokens: 500,
        });

        const responseText = completion.choices[0]?.message?.content || "I couldn't process that request.";

        // Return both formats for compatibility
        return NextResponse.json({
            response: responseText,
            reply: responseText
        });

    } catch (error: any) {
        console.error("Chat error:", error?.message || error);
        return NextResponse.json({ error: "Failed to get response" }, { status: 500 });
    }
}
