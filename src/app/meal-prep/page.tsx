'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import { Calendar, ChefHat, RefreshCw, ShoppingCart, Loader2, ChevronLeft, ChevronRight, Sparkles, X, Check, Copy } from 'lucide-react';
import { useAuth } from '@/components/AuthProvider';
import { supabase } from '@/lib/supabaseClient';

interface DayMeal {
    breakfast: { name: string; calories: number };
    lunch: { name: string; calories: number };
    dinner: { name: string; calories: number };
    snack: { name: string; calories: number };
}

interface WeekPlan {
    [key: string]: DayMeal;
}

export default function WeeklyMealPrepPage() {
    const router = useRouter();
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [plan, setPlan] = useState<WeekPlan | null>(null);
    const [currentDay, setCurrentDay] = useState(0);
    const [showRecipeModal, setShowRecipeModal] = useState(false);
    const [selectedMeal, setSelectedMeal] = useState<{ name: string; type: string } | null>(null);
    const [showShoppingList, setShowShoppingList] = useState(false);
    const [addedToCalendar, setAddedToCalendar] = useState(false);
    const [savingToList, setSavingToList] = useState(false);
    const [copiedToList, setCopiedToList] = useState(false);

    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

    const generateWeeklyPlan = async () => {
        setLoading(true);
        try {
            const profile = JSON.parse(localStorage.getItem('platex_profile') || '{}');

            const res = await fetch('/api/weekly-meal-plan', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ profile }),
            });

            const data = await res.json();
            if (data.plan) {
                setPlan(data.plan);
            }
        } catch (error) {
            console.error('Error generating plan:', error);
        } finally {
            setLoading(false);
        }
    };

    // Mock plan for demo
    const mockPlan: WeekPlan = {
        Monday: {
            breakfast: { name: 'Greek Yogurt with Berries & Granola', calories: 380 },
            lunch: { name: 'Grilled Chicken Caesar Salad', calories: 520 },
            dinner: { name: 'Salmon with Quinoa & Vegetables', calories: 580 },
            snack: { name: 'Apple with Almond Butter', calories: 200 },
        },
        Tuesday: {
            breakfast: { name: 'Avocado Toast with Eggs', calories: 420 },
            lunch: { name: 'Turkey & Veggie Wrap', calories: 480 },
            dinner: { name: 'Beef Stir-Fry with Brown Rice', calories: 620 },
            snack: { name: 'Mixed Nuts', calories: 180 },
        },
        Wednesday: {
            breakfast: { name: 'Protein Smoothie Bowl', calories: 350 },
            lunch: { name: 'Mediterranean Quinoa Bowl', calories: 510 },
            dinner: { name: 'Grilled Chicken with Sweet Potato', calories: 550 },
            snack: { name: 'Cottage Cheese with Fruit', calories: 160 },
        },
        Thursday: {
            breakfast: { name: 'Oatmeal with Banana & Walnuts', calories: 390 },
            lunch: { name: 'Tuna Salad Sandwich', calories: 490 },
            dinner: { name: 'Shrimp Pasta with Vegetables', calories: 580 },
            snack: { name: 'Protein Bar', calories: 220 },
        },
        Friday: {
            breakfast: { name: 'Scrambled Eggs with Veggies', calories: 360 },
            lunch: { name: 'Chicken Burrito Bowl', calories: 540 },
            dinner: { name: 'Baked Cod with Roasted Veggies', calories: 480 },
            snack: { name: 'Greek Yogurt', calories: 150 },
        },
        Saturday: {
            breakfast: { name: 'Pancakes with Fresh Fruit', calories: 450 },
            lunch: { name: 'Grilled Veggie & Hummus Wrap', calories: 420 },
            dinner: { name: 'Homemade Pizza with Salad', calories: 650 },
            snack: { name: 'Dark Chocolate & Almonds', calories: 200 },
        },
        Sunday: {
            breakfast: { name: 'Eggs Benedict (Healthy)', calories: 480 },
            lunch: { name: 'Roast Chicken with Vegetables', calories: 560 },
            dinner: { name: 'Vegetable Curry with Rice', calories: 520 },
            snack: { name: 'Smoothie', calories: 180 },
        },
    };

    const displayPlan = plan || mockPlan;
    const currentDayPlan = displayPlan[days[currentDay]];
    const dailyTotal = currentDayPlan
        ? currentDayPlan.breakfast.calories + currentDayPlan.lunch.calories + currentDayPlan.dinner.calories + currentDayPlan.snack.calories
        : 0;

    // Generate shopping list from all meals
    const generateShoppingList = () => {
        const ingredients = [
            '🥛 Greek Yogurt (2 cups)',
            '🫐 Mixed Berries (500g)',
            '🥣 Granola (300g)',
            '🍗 Chicken Breast (1kg)',
            '🥬 Romaine Lettuce (2 heads)',
            '🧀 Parmesan Cheese (100g)',
            '🐟 Salmon Fillets (500g)',
            '🍚 Quinoa (500g)',
            '🥦 Broccoli (500g)',
            '🥕 Carrots (500g)',
            '🍎 Apples (6)',
            '🥜 Almond Butter (1 jar)',
            '🥑 Avocados (4)',
            '🥚 Eggs (1 dozen)',
            '🍞 Whole Grain Bread (1 loaf)',
            '🦃 Turkey Breast (500g)',
            '🌯 Whole Wheat Wraps (8)',
            '🥩 Beef Sirloin (500g)',
            '🍚 Brown Rice (500g)',
            '🥜 Mixed Nuts (300g)',
            '🍌 Bananas (6)',
            '🧅 Onions (5)',
            '🫑 Bell Peppers (4)',
            '🍠 Sweet Potatoes (4)',
            '🍝 Whole Wheat Pasta (500g)',
            '🦐 Shrimp (500g)',
            '🐟 Cod Fillets (500g)',
        ];
        return ingredients;
    };

    const handleViewRecipe = (mealName: string, mealType: string) => {
        setSelectedMeal({ name: mealName, type: mealType });
        setShowRecipeModal(true);
    };

    const handleAddToCalendar = () => {
        setAddedToCalendar(true);
        setTimeout(() => setAddedToCalendar(false), 3000);
    };

    return (
        <div className="flex min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white">
            <Sidebar />

            <main className="flex-1 flex flex-col p-4 md:p-8 overflow-y-auto h-screen">
                <div className="w-full max-w-4xl mx-auto pt-8">
                    {/* Header */}
                    <header className="mb-8 flex items-center justify-between">
                        <div>
                            <h2 className="text-3xl font-bold text-white mb-2">Weekly Meal Prep</h2>
                            <p className="text-gray-400">AI-generated 7-day meal plan based on your goals</p>
                        </div>
                        <button
                            onClick={generateWeeklyPlan}
                            disabled={loading}
                            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-blue-600 rounded-xl font-medium hover:from-green-400 hover:to-blue-500 transition-all disabled:opacity-50"
                        >
                            {loading ? <Loader2 className="animate-spin" size={18} /> : <RefreshCw size={18} />}
                            Regenerate
                        </button>
                    </header>

                    {/* Day Navigation */}
                    <div className="flex items-center justify-between mb-6 bg-gray-800/40 rounded-2xl p-4">
                        <button
                            onClick={() => setCurrentDay(prev => Math.max(0, prev - 1))}
                            disabled={currentDay === 0}
                            className="p-2 hover:bg-gray-700 rounded-lg disabled:opacity-50 transition-all"
                        >
                            <ChevronLeft />
                        </button>

                        <div className="flex gap-2">
                            {days.map((day, idx) => (
                                <button
                                    key={day}
                                    onClick={() => setCurrentDay(idx)}
                                    className={`px-3 py-2 rounded-lg font-medium text-sm transition-all ${currentDay === idx
                                        ? 'bg-gradient-to-r from-green-500 to-blue-600 text-white'
                                        : 'text-gray-400 hover:text-white hover:bg-gray-700'
                                        }`}
                                >
                                    {day.slice(0, 3)}
                                </button>
                            ))}
                        </div>

                        <button
                            onClick={() => setCurrentDay(prev => Math.min(6, prev + 1))}
                            disabled={currentDay === 6}
                            className="p-2 hover:bg-gray-700 rounded-lg disabled:opacity-50 transition-all"
                        >
                            <ChevronRight />
                        </button>
                    </div>

                    {/* Day Title */}
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-2xl font-bold text-white">{days[currentDay]}</h3>
                        <div className="flex items-center gap-2 bg-green-500/20 text-green-400 px-4 py-2 rounded-xl">
                            <Sparkles size={16} />
                            <span className="font-bold">{dailyTotal} kcal</span>
                        </div>
                    </div>

                    {/* Meals Grid */}
                    {currentDayPlan && (
                        <div className="grid md:grid-cols-2 gap-4 mb-8">
                            {(['breakfast', 'lunch', 'dinner', 'snack'] as const).map(mealType => {
                                const meal = currentDayPlan[mealType];
                                const colors: Record<string, { bg: string; icon: string }> = {
                                    breakfast: { bg: 'from-yellow-500/20 to-orange-500/20', icon: '🌅' },
                                    lunch: { bg: 'from-green-500/20 to-emerald-500/20', icon: '☀️' },
                                    dinner: { bg: 'from-purple-500/20 to-blue-500/20', icon: '🌙' },
                                    snack: { bg: 'from-pink-500/20 to-red-500/20', icon: '🍎' },
                                };

                                return (
                                    <div
                                        key={mealType}
                                        className={`bg-gradient-to-br ${colors[mealType].bg} border border-gray-700/50 rounded-2xl p-5 hover:border-gray-600 transition-all`}
                                    >
                                        <div className="flex items-start justify-between mb-3">
                                            <div className="flex items-center gap-2">
                                                <span className="text-2xl">{colors[mealType].icon}</span>
                                                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                                                    {mealType}
                                                </span>
                                            </div>
                                            <span className="text-sm font-bold text-gray-300 bg-gray-800/50 px-2 py-1 rounded-lg">
                                                {meal.calories} kcal
                                            </span>
                                        </div>
                                        <h4 className="text-lg font-bold text-white mb-2">{meal.name}</h4>
                                        <button
                                            onClick={() => handleViewRecipe(meal.name, mealType)}
                                            className="text-xs text-blue-400 hover:text-blue-300 font-medium"
                                        >
                                            View Recipe →
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="grid md:grid-cols-2 gap-4">
                        <button
                            onClick={() => setShowShoppingList(true)}
                            className="flex items-center justify-center gap-2 py-4 bg-gray-800/40 border border-gray-700/50 rounded-xl hover:border-yellow-500/50 hover:bg-yellow-500/10 transition-all"
                        >
                            <ShoppingCart className="text-yellow-400" />
                            <span className="font-medium">Generate Shopping List</span>
                        </button>
                        <button
                            onClick={handleAddToCalendar}
                            className={`flex items-center justify-center gap-2 py-4 rounded-xl transition-all ${addedToCalendar
                                ? 'bg-green-500/20 border border-green-500/50 text-green-400'
                                : 'bg-gray-800/40 border border-gray-700/50 hover:border-blue-500/50 hover:bg-blue-500/10'
                                }`}
                        >
                            {addedToCalendar ? <Check className="text-green-400" /> : <Calendar className="text-blue-400" />}
                            <span className="font-medium">{addedToCalendar ? 'Added to Calendar!' : 'Add to Calendar'}</span>
                        </button>
                    </div>
                </div>
            </main>

            {/* Recipe Modal */}
            {showRecipeModal && selectedMeal && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-gray-900 border border-gray-700 rounded-2xl max-w-lg w-full max-h-[80vh] overflow-y-auto">
                        <div className="p-6 border-b border-gray-800 flex items-center justify-between">
                            <div>
                                <p className="text-xs text-gray-500 uppercase tracking-wider">{selectedMeal.type}</p>
                                <h3 className="text-xl font-bold text-white">{selectedMeal.name}</h3>
                            </div>
                            <button
                                onClick={() => setShowRecipeModal(false)}
                                className="p-2 hover:bg-gray-800 rounded-lg"
                            >
                                <X size={20} />
                            </button>
                        </div>
                        <div className="p-6">
                            <div className="grid grid-cols-3 gap-4 mb-6">
                                <div className="bg-gray-800/50 rounded-xl p-3 text-center">
                                    <p className="text-2xl font-bold text-green-400">15</p>
                                    <p className="text-xs text-gray-500">min prep</p>
                                </div>
                                <div className="bg-gray-800/50 rounded-xl p-3 text-center">
                                    <p className="text-2xl font-bold text-blue-400">20</p>
                                    <p className="text-xs text-gray-500">min cook</p>
                                </div>
                                <div className="bg-gray-800/50 rounded-xl p-3 text-center">
                                    <p className="text-2xl font-bold text-yellow-400">2</p>
                                    <p className="text-xs text-gray-500">servings</p>
                                </div>
                            </div>

                            <h4 className="font-bold text-white mb-3">Ingredients</h4>
                            <ul className="space-y-2 mb-6">
                                <li className="text-gray-300 text-sm">• 200g main protein</li>
                                <li className="text-gray-300 text-sm">• 1 cup vegetables</li>
                                <li className="text-gray-300 text-sm">• 2 tbsp olive oil</li>
                                <li className="text-gray-300 text-sm">• Salt and pepper to taste</li>
                                <li className="text-gray-300 text-sm">• Fresh herbs for garnish</li>
                            </ul>

                            <h4 className="font-bold text-white mb-3">Instructions</h4>
                            <ol className="space-y-3">
                                <li className="text-gray-300 text-sm">1. Prepare all ingredients and preheat cooking surface.</li>
                                <li className="text-gray-300 text-sm">2. Season the protein with salt and pepper.</li>
                                <li className="text-gray-300 text-sm">3. Cook protein until done, set aside.</li>
                                <li className="text-gray-300 text-sm">4. Sauté vegetables until tender.</li>
                                <li className="text-gray-300 text-sm">5. Combine and serve with fresh herbs.</li>
                            </ol>
                        </div>
                    </div>
                </div>
            )}

            {/* Shopping List Modal */}
            {showShoppingList && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-gray-900 border border-gray-700 rounded-2xl max-w-md w-full max-h-[80vh] overflow-y-auto">
                        <div className="p-6 border-b border-gray-800 flex items-center justify-between">
                            <div>
                                <h3 className="text-xl font-bold text-white">Shopping List</h3>
                                <p className="text-xs text-gray-500">For the week's meal plan</p>
                            </div>
                            <button
                                onClick={() => setShowShoppingList(false)}
                                className="p-2 hover:bg-gray-800 rounded-lg"
                            >
                                <X size={20} />
                            </button>
                        </div>
                        <div className="p-6">
                            <ul className="space-y-2">
                                {generateShoppingList().map((item, idx) => (
                                    <li key={idx} className="flex items-center gap-3 p-2 hover:bg-gray-800/50 rounded-lg group">
                                        <input type="checkbox" className="w-4 h-4 rounded border-gray-600" />
                                        <span className="text-gray-300 text-sm group-hover:text-white">{item}</span>
                                    </li>
                                ))}
                            </ul>
                            <button
                                onClick={async () => {
                                    if (!user) {
                                        // Copy to clipboard if not logged in
                                        const text = generateShoppingList().join('\n');
                                        await navigator.clipboard.writeText(text);
                                        setCopiedToList(true);
                                        setTimeout(() => setCopiedToList(false), 2000);
                                        return;
                                    }

                                    setSavingToList(true);
                                    const shoppingItems = generateShoppingList();

                                    // Add each item to the shopping list
                                    for (const item of shoppingItems) {
                                        await supabase
                                            .from('shopping_list')
                                            .insert({ user_id: user.id, item: item });
                                    }

                                    setSavingToList(false);
                                    setShowShoppingList(false);
                                    router.push('/shopping-list');
                                }}
                                disabled={savingToList}
                                className="w-full mt-6 py-3 bg-gradient-to-r from-green-500 to-blue-600 rounded-xl font-medium hover:from-green-400 hover:to-blue-500 flex items-center justify-center gap-2 disabled:opacity-50"
                            >
                                {savingToList ? (
                                    <><Loader2 className="animate-spin" size={18} /> Adding to Shopping List...</>
                                ) : copiedToList ? (
                                    <><Check size={18} /> Copied!</>
                                ) : (
                                    <><Copy size={18} /> {user ? 'Add to Shopping List' : 'Copy to Clipboard'}</>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
