import { NextResponse } from "next/server";
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import Groq from "groq-sdk";

export async function GET(req: Request) {
    try {
        const cookieStore = await cookies();

        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            {
                cookies: {
                    getAll() {
                        return cookieStore.getAll();
                    },
                    setAll(cookiesToSet) {
                        cookiesToSet.forEach(({ name, value, options }) => {
                            cookieStore.set(name, value, options);
                        });
                    },
                },
            }
        );

        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
        }

        // Get this week's food logs
        const today = new Date();
        const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);

        const { data: logs, error } = await supabase
            .from('food_logs')
            .select('*')
            .eq('user_id', user.id)
            .gte('created_at', weekAgo.toISOString())
            .order('created_at', { ascending: false });

        if (error) {
            console.error("Database error:", error);
            return NextResponse.json({ error: "Failed to fetch logs" }, { status: 500 });
        }

        // Calculate weekly stats
        const stats = {
            totalMeals: logs?.length || 0,
            avgCalories: 0,
            avgProtein: 0,
            avgCarbs: 0,
            avgFat: 0,
            totalCalories: 0,
            totalProtein: 0,
            healthScoreAvg: 0,
        };

        if (logs && logs.length > 0) {
            stats.totalCalories = logs.reduce((sum, log) => sum + (log.total_calories || 0), 0);
            stats.totalProtein = logs.reduce((sum, log) => sum + (log.total_protein || 0), 0);
            stats.avgCalories = Math.round(stats.totalCalories / logs.length);
            stats.avgProtein = Math.round(stats.totalProtein / logs.length);
            stats.avgCarbs = Math.round(logs.reduce((sum, log) => sum + (log.total_carbs || 0), 0) / logs.length);
            stats.avgFat = Math.round(logs.reduce((sum, log) => sum + (log.total_fat || 0), 0) / logs.length);
            stats.healthScoreAvg = Math.round(logs.reduce((sum, log) => sum + (log.health_score || 0), 0) / logs.length);
        }

        // Generate AI summary
        const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

        const prompt = `Generate a brief, encouraging weekly nutrition summary for a user with these stats:
- ${stats.totalMeals} meals logged this week
- Average ${stats.avgCalories} calories per meal
- Average ${stats.avgProtein}g protein per meal
- Average health score: ${stats.healthScoreAvg}/100

Provide:
1. A 2-sentence overall assessment
2. One thing they did well
3. One area for improvement
4. A motivational tip

Keep it concise and friendly. Use 1-2 emojis.`;

        const completion = await groq.chat.completions.create({
            messages: [{ role: "user", content: prompt }],
            model: "llama-3.3-70b-versatile",
            temperature: 0.7,
            max_tokens: 300,
        });

        const aiSummary = completion.choices[0]?.message?.content || "Keep up the great work with your nutrition journey!";

        return NextResponse.json({
            stats,
            aiSummary,
            weekStart: weekAgo.toISOString().split('T')[0],
            weekEnd: today.toISOString().split('T')[0],
        });

    } catch (error: any) {
        console.error("Weekly report error:", error?.message || error);
        return NextResponse.json({ error: "Failed to generate report" }, { status: 500 });
    }
}
