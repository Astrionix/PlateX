import { NextResponse } from "next/server";
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function POST(req: Request) {
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

        const { recipe, mealType, date } = await req.json();

        if (!recipe) {
            return NextResponse.json({ error: "Recipe data required" }, { status: 400 });
        }

        // Save to saved_recipes table
        const { data, error } = await supabase
            .from('saved_recipes')
            .insert({
                user_id: user.id,
                name: recipe.name,
                description: recipe.description || '',
                time: recipe.time || '30 mins',
                calories: recipe.calories || 0,
                ingredients: recipe.ingredients || [],
                instructions: recipe.instructions || '',
                meal_type: mealType || 'Snack',
                planned_date: date || new Date().toISOString().split('T')[0],
                created_at: new Date().toISOString()
            })
            .select()
            .single();

        if (error) {
            console.error("Database error:", error);
            return NextResponse.json({ error: "Failed to save recipe", details: error.message }, { status: 500 });
        }

        return NextResponse.json({ success: true, recipe: data });

    } catch (error: any) {
        console.error("Save recipe error:", error?.message || error);
        return NextResponse.json({ error: "Failed to save recipe", details: error?.message }, { status: 500 });
    }
}

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

        const { data, error } = await supabase
            .from('saved_recipes')
            .select('*')
            .eq('user_id', user.id)
            .order('planned_date', { ascending: true });

        if (error) {
            console.error("Database error:", error);
            return NextResponse.json({ error: "Failed to fetch recipes" }, { status: 500 });
        }

        return NextResponse.json({ recipes: data });

    } catch (error: any) {
        console.error("Fetch recipes error:", error?.message || error);
        return NextResponse.json({ error: "Failed to fetch recipes" }, { status: 500 });
    }
}
