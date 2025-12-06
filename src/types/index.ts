export interface Profile {
    id?: string;
    name: string;
    age: number;
    gender: 'male' | 'female' | 'other';
    height: number;
    weight: number;
    activityLevel: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
    goal: 'fat_loss' | 'maintenance' | 'muscle_gain';
    preference: 'omnivore' | 'vegetarian' | 'vegan' | 'keto' | 'paleo';
    allergies: string[];
    medicalConditions: string[];
    dailyTargets?: {
        calories: number;
        protein: number;
        carbs: number;
        fat: number;
        water: number;
    };
}

export interface FoodLog {
    id: string;
    image_url: string;
    total_calories: number;
    total_protein: number;
    total_carbs: number;
    total_fat: number;
    health_score: number;
    ingredients: Ingredient[];
    created_at: string;
    meal_type?: string;
    warnings?: string[];
    glycemic_load?: string;
}

export interface Ingredient {
    name: string;
    grams: number;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber?: number;
    sugar?: number;
}
