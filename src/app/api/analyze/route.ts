import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase Admin Client (for storage/db writes)
const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Initialize Gemini inside handler to ensure env vars are loaded

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const image = formData.get('image') as File;
        const text = formData.get('text') as string;

        if (!image && !text) {
            return NextResponse.json({ error: 'No image or text provided' }, { status: 400 });
        }

        let imageUrl = '';

        // 1. Upload Image to Supabase Storage (if image exists)
        if (image) {
            const bytes = await image.arrayBuffer();
            const buffer = Buffer.from(bytes);
            const fileName = `Platex/${Date.now()}_${image.name}`;

            const { data: uploadData, error: uploadError } = await supabaseAdmin
                .storage
                .from('Platex')
                .upload(fileName, buffer, {
                    contentType: image.type,
                    upsert: false
                });

            if (uploadError) {
                console.error('Upload Error:', uploadError);
            }

            if (uploadData) {
                const { data: { publicUrl } } = supabaseAdmin
                    .storage
                    .from('Platex')
                    .getPublicUrl(fileName);
                imageUrl = publicUrl;
            }
        }

        const isDemo = formData.get('is_demo') === 'true';

        // 2. Call Gemini Vision
        if (!process.env.GEMINI_API_KEY || isDemo) {
            console.warn("No GEMINI_API_KEY found. Returning mock data.");
            return NextResponse.json({
                id: "mock-id",
                image_url: imageUrl || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c",
                ingredients: [
                    {
                        name: "Grilled Chicken Breast",
                        category: "Protein",
                        portion_estimate: "150g",
                        grams: 150,
                        calories: 247,
                        carbs: 0,
                        protein: 46,
                        fat: 5,
                        fiber: 0,
                        sugar: 0
                    },
                    {
                        name: "Quinoa",
                        category: "Carb",
                        portion_estimate: "1 cup",
                        grams: 185,
                        calories: 222,
                        carbs: 39,
                        protein: 8,
                        fat: 4,
                        fiber: 5,
                        sugar: 1
                    },
                    {
                        name: "Roasted Broccoli",
                        category: "Vegetable",
                        portion_estimate: "1 cup",
                        grams: 90,
                        calories: 35,
                        carbs: 6,
                        protein: 2,
                        fat: 0,
                        fiber: 2,
                        sugar: 1
                    }
                ],
                total_calories: 504,
                total_carbs: 45,
                total_protein: 56,
                total_fat: 9,
                total_fiber: 7,
                total_sugar: 2,
                health_score: 92,
                glycemic_load: "Low",
                warnings: [],
                is_mock: true
            });
        }

        const apiKey = process.env.GEMINI_API_KEY;
        console.log("Using Gemini API Key:", apiKey ? `${apiKey.substring(0, 5)}...` : "None");

        console.log("Using Supabase URL:", process.env.NEXT_PUBLIC_SUPABASE_URL);

        const genAI = new GoogleGenerativeAI(apiKey || '');
        const model = genAI.getGenerativeModel({
            model: "gemini-2.0-flash",
        });

        const prompt = `You are an expert nutritionist. Analyze the food in this image.
1. Identify ALL visible food items separately (e.g., "Grilled Chicken", "Brown Rice", "Broccoli").
2. Estimate the portion size (e.g., "1 cup", "150g") and weight in grams for each item.
3. Estimate calories, carbs, protein, fat, fiber, and sugar for each item based on the estimated weight.
4. Provide a health score (0-100) based on balance, nutrient density, and processing level.
5. Estimate the Glycemic Load (Low, Medium, High).
6. Provide specific warnings if applicable (e.g., "High Sodium", "High Sugar", "Low Protein").

Return a JSON object with this exact schema:
{
  "ingredients": [
    { 
      "name": "string", 
      "category": "string", 
      "portion_estimate": "string", 
      "grams": number, 
      "calories": number, 
      "carbs": number, 
      "protein": number, 
      "fat": number,
      "fiber": number,
      "sugar": number
    }
  ],
  "total_calories": number,
  "total_carbs": number,
  "total_protein": number,
  "total_fat": number,
  "total_fiber": number,
  "total_sugar": number,
  "health_score": number,
  "glycemic_load": "string",
  "warnings": ["string"]
}
Do not include markdown formatting. Return only the JSON string.`;

        let result;
        if (image) {
            const bytes = await image.arrayBuffer();
            const imageParts = [
                {
                    inlineData: {
                        data: Buffer.from(bytes).toString("base64"),
                        mimeType: image.type,
                    },
                },
            ];
            result = await model.generateContent([prompt, ...imageParts]);
        } else {
            result = await model.generateContent(prompt + `\nDescription: ${text}`);
        }

        const response = await result.response;
        let textResponse = response.text();

        // Clean up markdown if present
        textResponse = textResponse.replace(/```json/g, '').replace(/```/g, '').trim();

        const analysisData = JSON.parse(textResponse);

        // 3. Save to Supabase DB (food_logs)
        const { data: logData, error: logError } = await supabaseAdmin
            .from('food_logs')
            .insert({
                image_url: imageUrl,
                raw_model_output: analysisData,
                ingredients: analysisData.ingredients,
                total_calories: analysisData.total_calories,
                total_carbs: analysisData.total_carbs,
                total_protein: analysisData.total_protein,
                total_fat: analysisData.total_fat,
                total_fiber: analysisData.total_fiber || 0,
                total_sugar: analysisData.total_sugar || 0,
                health_score: analysisData.health_score,
                glycemic_load: analysisData.glycemic_load,
                warnings: analysisData.warnings
            })
            .select()
            .single();

        if (logError) {
            console.error('DB Insert Error:', logError);
        }

        return NextResponse.json({
            ...analysisData,
            id: logData?.id,
            image_url: imageUrl || analysisData.image_url
        });

    } catch (error: any) {
        console.error('Analysis Error:', error);
        return NextResponse.json({
            error: 'Internal Server Error',
            details: error.message || String(error),
            stack: error.stack
        }, { status: 500 });
    }
}
