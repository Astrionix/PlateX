import { NextResponse } from "next/server";

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const code = searchParams.get('code');

    if (!code) {
        return NextResponse.json({ error: "Barcode is required" }, { status: 400 });
    }

    try {
        const res = await fetch(`https://world.openfoodfacts.org/api/v0/product/${code}.json`);
        const data = await res.json();

        if (data.status === 0) {
            return NextResponse.json({ error: "Product not found" }, { status: 404 });
        }

        const p = data.product;

        // Map to our format
        const result = {
            product_name: p.product_name,
            brand: p.brands,
            image_url: p.image_url,
            calories: p.nutriments?.['energy-kcal_100g'] || 0,
            protein: p.nutriments?.['proteins_100g'] || 0,
            carbs: p.nutriments?.['carbohydrates_100g'] || 0,
            fat: p.nutriments?.['fat_100g'] || 0,
            health_score: 100 - (p.nutriments?.['sugar_100g'] || 0) * 2, // Rough estimate
            serving_size: p.serving_size
        };

        return NextResponse.json(result);

    } catch (error) {
        console.error("Barcode lookup error:", error);
        return NextResponse.json({ error: "Failed to fetch product data" }, { status: 500 });
    }
}
