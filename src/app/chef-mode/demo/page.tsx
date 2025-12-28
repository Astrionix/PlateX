
'use client';

import { useState } from 'react';
import ChefMode from '@/components/ChefMode';
import { useRouter } from 'next/navigation';

export default function ChefModeDemoPage() {
    const router = useRouter();
    const [isActive, setIsActive] = useState(true);

    const recipe = {
        title: "Avocado Toast with Poached Eggs",
        ingredients: [
            "2 slices whole grain bread",
            "1 ripe avocado",
            "2 eggs",
            "1 tsp chili flakes",
            "Salt & Pepper",
            "1 tsp vinegar"
        ],
        steps: [
            { instruction: "Fill a pot with water, add vinegar, and bring to a gentle simmer.", duration: 5 },
            { instruction: "Toast the bread slices until golden brown.", duration: 3 },
            { instruction: "While bread is toasting, mash the avocado with salt, pepper, and lemon juice." },
            { instruction: "Crack eggs into small bowls. Create a gentle whirlpool in the water and slide eggs in.", duration: 1 },
            { instruction: "Poach eggs for 3 minutes for a runny yolk.", duration: 3 },
            { instruction: "Spread mashed avocado on toast." },
            { instruction: "Top with poached eggs and sprinkle with chili flakes." }
        ]
    };

    if (!isActive) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <button
                    onClick={() => setIsActive(true)}
                    className="px-8 py-4 bg-green-500 rounded-xl text-white font-bold text-xl hover:scale-105 transition-all"
                >
                    Start Demo
                </button>
            </div>
        );
    }

    return (
        <ChefMode
            title={recipe.title}
            ingredients={recipe.ingredients}
            steps={recipe.steps}
            onClose={() => router.back()}
        />
    );
}
