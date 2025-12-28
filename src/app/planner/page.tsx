'use client';

import { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import { Loader2, Utensils, Flame, ChevronRight, AlertCircle, ChefHat, Trash2, Clock } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/components/AuthProvider';
import BioRhythmSync from '@/components/BioRhythmSync';
import { GET_API_URL } from '@/lib/api-config';

interface Meal {
    type: string;
    name: string;
    description: string;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
}

interface DietPlan {
    target_calories: number;
    target_macros: {
        protein: string;
        carbs: string;
        fat: string;
    };
    meals: Meal[];
    advice: string;
}

interface SavedRecipe {
    id: string;
    name: string;
    description: string;
    time: string;
    calories: number;
    ingredients: string[];
    instructions: string;
    meal_type: string;
    planned_date: string;
}

export default function Planner() {
    const { user } = useAuth();
    const [profile, setProfile] = useState<any>(null);
    const [plan, setPlan] = useState<DietPlan | null>(null);
    const [loading, setLoading] = useState(false);
    const [savedRecipes, setSavedRecipes] = useState<SavedRecipe[]>([]);
    const [loadingRecipes, setLoadingRecipes] = useState(false);

    useEffect(() => {
        const savedProfile = localStorage.getItem('platex_profile');
        if (savedProfile) {
            setProfile(JSON.parse(savedProfile));
        }
    }, []);

    useEffect(() => {
        if (user) {
            fetchSavedRecipes();
        }
    }, [user]);

    const fetchSavedRecipes = async () => {
        setLoadingRecipes(true);
        try {
            const res = await fetch(GET_API_URL('/api/save-recipe'));
            const data = await res.json();
            if (data.recipes) {
                setSavedRecipes(data.recipes);
            }
        } catch (error) {
            console.error('Error fetching saved recipes:', error);
        } finally {
            setLoadingRecipes(false);
        }
    };

    const generatePlan = async () => {
        setLoading(true);
        try {
            const res = await fetch(GET_API_URL('/api/planner'), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ profile }),
            });
            const data = await res.json();
            if (res.ok) {
                setPlan(data);
            } else {
                alert('Failed to generate plan. Please try again.');
            }
        } catch (error) {
            console.error(error);
            alert('Error generating plan.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white">
            <Sidebar />

            <main className="flex-1 flex flex-col p-4 md:p-8 overflow-y-auto h-screen">
                <div className="w-full max-w-4xl mx-auto pt-8">
                    <header className="mb-8">
                        <h2 className="text-3xl font-bold text-white mb-2">AI Diet Planner</h2>
                        <p className="text-gray-400">Generate personalized meal plans and view your saved recipes.</p>
                    </header>

                    {/* Saved Recipes Section */}
                    {user && savedRecipes.length > 0 && (
                        <div className="mb-8">
                            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                                <ChefHat className="text-green-400" /> My Saved Recipes
                            </h3>
                            <div className="grid md:grid-cols-2 gap-4">
                                {savedRecipes.map((recipe) => (
                                    <div key={recipe.id} className="bg-gray-800/40 border border-gray-700/50 rounded-xl p-5 hover:bg-gray-800/60 transition-colors">
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <span className="text-xs font-bold text-green-400 uppercase tracking-wider">{recipe.meal_type}</span>
                                                <h4 className="text-lg font-bold text-white">{recipe.name}</h4>
                                            </div>
                                            <span className="text-sm font-bold text-gray-300 bg-gray-700/50 px-3 py-1 rounded-full">
                                                {recipe.calories} kcal
                                            </span>
                                        </div>
                                        <p className="text-gray-400 text-sm mb-3 line-clamp-2">{recipe.description}</p>
                                        <div className="flex items-center gap-4 text-xs text-gray-500">
                                            <span className="flex items-center gap-1"><Clock size={12} /> {recipe.time}</span>
                                            <span>📅 {new Date(recipe.planned_date).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {loadingRecipes && (
                        <div className="flex justify-center py-8">
                            <Loader2 className="animate-spin text-gray-400" />
                        </div>
                    )}

                    {!profile ? (
                        <div className="bg-yellow-500/10 border border-yellow-500/50 rounded-xl p-6 text-center">
                            <AlertCircle className="w-12 h-12 text-yellow-500 mx-auto mb-3" />
                            <h3 className="text-xl font-bold text-white mb-2">Profile Missing</h3>
                            <p className="text-gray-400 mb-4">Please set up your profile first to generate a diet plan.</p>
                            <Link href="/profile" className="inline-block bg-yellow-500 text-black font-bold px-6 py-2 rounded-lg hover:bg-yellow-400 transition-colors">
                                Go to Profile
                            </Link>
                        </div>
                    ) : (
                        <div className="space-y-8">
                            <BioRhythmSync onUpdate={(adj) => console.log('Adjusting plan by', adj)} />

                            {!plan && (
                                <div className="bg-gray-800/30 backdrop-blur-md border border-gray-700/50 rounded-2xl p-8 text-center shadow-xl">
                                    <Utensils className="w-16 h-16 text-blue-400 mx-auto mb-4 opacity-80" />
                                    <h3 className="text-2xl font-bold text-white mb-2">Ready to Plan?</h3>
                                    <p className="text-gray-400 mb-6 max-w-md mx-auto">
                                        Based on your goal of <span className="text-blue-400 font-semibold capitalize">{profile.goal.replace('_', ' ')}</span>,
                                        we'll create a customized meal plan for you.
                                    </p>
                                    <button
                                        onClick={generatePlan}
                                        disabled={loading}
                                        className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-400 hover:to-purple-500 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg shadow-blue-500/25 transition-all transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3 mx-auto"
                                    >
                                        {loading ? (
                                            <><Loader2 className="animate-spin" /> Generating Plan...</>
                                        ) : (
                                            <><Flame className="fill-current" /> Generate Daily Plan</>
                                        )}
                                    </button>
                                </div>
                            )}

                            {plan && (
                                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-700">
                                    {/* Summary Card */}
                                    <div className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-2xl p-6 shadow-xl">
                                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                                            <div>
                                                <h3 className="text-xl font-bold text-white">Daily Targets</h3>
                                                <p className="text-gray-400 text-sm">Optimized for {profile.goal.replace('_', ' ')}</p>
                                            </div>
                                            <div className="flex gap-4">
                                                <div className="text-center bg-gray-800/50 p-3 rounded-lg border border-gray-700">
                                                    <div className="text-2xl font-bold text-green-400">{plan.target_calories}</div>
                                                    <div className="text-xs text-gray-500 uppercase tracking-wider">Calories</div>
                                                </div>
                                                <div className="text-center bg-gray-800/50 p-3 rounded-lg border border-gray-700">
                                                    <div className="text-xl font-bold text-blue-400">{plan.target_macros.protein}</div>
                                                    <div className="text-xs text-gray-500 uppercase tracking-wider">Protein</div>
                                                </div>
                                                <div className="text-center bg-gray-800/50 p-3 rounded-lg border border-gray-700">
                                                    <div className="text-xl font-bold text-yellow-400">{plan.target_macros.carbs}</div>
                                                    <div className="text-xs text-gray-500 uppercase tracking-wider">Carbs</div>
                                                </div>
                                                <div className="text-center bg-gray-800/50 p-3 rounded-lg border border-gray-700">
                                                    <div className="text-xl font-bold text-red-400">{plan.target_macros.fat}</div>
                                                    <div className="text-xs text-gray-500 uppercase tracking-wider">Fat</div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                                            <p className="text-blue-200 text-sm italic">"{plan.advice}"</p>
                                        </div>
                                    </div>

                                    {/* Meals List */}
                                    <div className="grid gap-4">
                                        {plan.meals.map((meal, idx) => (
                                            <div key={idx} className="bg-gray-800/40 border border-gray-700/50 rounded-xl p-5 hover:bg-gray-800/60 transition-colors group">
                                                <div className="flex justify-between items-start mb-3">
                                                    <div>
                                                        <span className="text-xs font-bold text-blue-400 uppercase tracking-wider mb-1 block">{meal.type}</span>
                                                        <h4 className="text-lg font-bold text-white group-hover:text-blue-300 transition-colors">{meal.name}</h4>
                                                    </div>
                                                    <span className="text-sm font-bold text-gray-300 bg-gray-700/50 px-3 py-1 rounded-full">
                                                        {meal.calories} kcal
                                                    </span>
                                                </div>
                                                <p className="text-gray-400 text-sm mb-4">{meal.description}</p>
                                                <div className="flex gap-4 text-xs text-gray-500 border-t border-gray-700/50 pt-3">
                                                    <span><strong className="text-gray-300">P:</strong> {meal.protein}g</span>
                                                    <span><strong className="text-gray-300">C:</strong> {meal.carbs}g</span>
                                                    <span><strong className="text-gray-300">F:</strong> {meal.fat}g</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="text-center pt-4">
                                        <button
                                            onClick={generatePlan}
                                            className="text-gray-400 hover:text-white text-sm flex items-center justify-center gap-2 mx-auto transition-colors"
                                        >
                                            <Loader2 className="w-4 h-4" /> Regenerate Plan
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
