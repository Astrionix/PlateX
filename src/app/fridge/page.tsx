'use client';

import { useState } from 'react';
import ThreeBackground from '@/components/ThreeBackground';
import Sidebar from '@/components/Sidebar';
import { ChefHat, Loader2, Plus, Sparkles, X, Check, Calendar } from 'lucide-react';
import { useAuth } from '@/components/AuthProvider';
import { useRouter } from 'next/navigation';

export default function Fridge() {
    const { user } = useAuth();
    const router = useRouter();
    const [ingredients, setIngredients] = useState<string[]>([]);
    const [newIngredient, setNewIngredient] = useState('');
    const [recipe, setRecipe] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [showMealPicker, setShowMealPicker] = useState(false);

    const [error, setError] = useState<string | null>(null);

    const mealTypes = ['Breakfast', 'Lunch', 'Dinner', 'Snack'];

    const addIngredient = (e: React.FormEvent) => {
        e.preventDefault();
        if (newIngredient.trim()) {
            setIngredients([...ingredients, newIngredient.trim()]);
            setNewIngredient('');
        }
    };

    const removeIngredient = (index: number) => {
        setIngredients(ingredients.filter((_, i) => i !== index));
    };

    const generateRecipe = async () => {
        if (ingredients.length === 0) return;
        setLoading(true);
        setRecipe(null);
        setError(null);
        try {
            const res = await fetch('/api/suggest-recipe', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ingredients }),
            });
            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || data.details || 'Failed to generate recipe');
            }

            if (data.recipe) {
                setRecipe(data.recipe);
            } else {
                throw new Error('No recipe returned');
            }
        } catch (err: any) {
            console.error('Error:', err);
            setError(err.message || 'Failed to generate recipe');
        } finally {
            setLoading(false);
        }
    };

    const saveToPlanner = async (mealType: string) => {
        if (!recipe || !user) return;
        setSaving(true);
        try {
            const res = await fetch('/api/save-recipe', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    recipe,
                    mealType,
                    date: new Date().toISOString().split('T')[0]
                }),
            });
            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Failed to save recipe');
            }

            setSaved(true);
            setShowMealPicker(false);
            setTimeout(() => setSaved(false), 3000);
        } catch (err: any) {
            console.error('Save error:', err);
            setError(err.message || 'Failed to save recipe');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="flex min-h-screen relative text-white overflow-hidden">
            <ThreeBackground />
            <Sidebar />

            <main className="flex-1 flex flex-col p-4 md:p-8 overflow-y-auto h-screen relative z-10">
                <div className="w-full max-w-4xl mx-auto pt-8">
                    <header className="mb-8">
                        <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-blue-500 mb-2">Clean the Fridge</h2>
                        <p className="text-gray-400">Enter your leftovers or pantry items, and we'll chef up a recipe.</p>
                    </header>

                    <div className="grid md:grid-cols-2 gap-8">
                        {/* Input Section */}
                        <div className="space-y-6">
                            <div className="bg-gray-800/50 backdrop-blur-md border border-gray-700 rounded-2xl p-6">
                                <form onSubmit={addIngredient} className="relative mb-6">
                                    <input
                                        type="text"
                                        value={newIngredient}
                                        onChange={(e) => setNewIngredient(e.target.value)}
                                        placeholder="Add ingredient (e.g., Eggs, Spinach)"
                                        className="w-full bg-gray-900 border border-gray-600 rounded-xl px-4 py-3 text-white focus:border-green-500 outline-none pr-12"
                                    />
                                    <button
                                        type="submit"
                                        className="absolute right-2 top-2 p-1.5 bg-green-500 rounded-lg text-black hover:bg-green-400 transition-colors"
                                    >
                                        <Plus size={20} />
                                    </button>
                                </form>

                                <div className="flex flex-wrap gap-2 mb-6 min-h-[100px] content-start">
                                    {ingredients.length === 0 && (
                                        <div className="text-gray-500 text-sm italic w-full text-center py-4">
                                            Your basket is empty. Add items above!
                                        </div>
                                    )}
                                    {ingredients.map((ing, i) => (
                                        <span key={i} className="flex items-center gap-2 bg-gray-700/50 px-3 py-1.5 rounded-full text-sm border border-gray-600 animate-in zoom-in duration-200">
                                            {ing}
                                            <button onClick={() => removeIngredient(i)} className="text-gray-400 hover:text-white">
                                                <X size={14} />
                                            </button>
                                        </span>
                                    ))}
                                </div>

                                <button
                                    onClick={generateRecipe}
                                    disabled={ingredients.length === 0 || loading}
                                    className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-white font-bold py-3 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all shadow-lg shadow-green-500/20"
                                >
                                    {loading ? <Loader2 className="animate-spin" /> : <ChefHat />}
                                    {loading ? 'Cooking...' : 'Generate Recipe'}
                                </button>

                                {error && (
                                    <div className="mt-4 p-3 rounded-lg bg-red-500/20 border border-red-500/30 text-red-300 text-sm">
                                        {error}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Result Section */}
                        <div className="relative">
                            {recipe ? (
                                <div className="bg-white text-black rounded-2xl p-8 shadow-2xl animate-in fade-in slide-in-from-bottom-8 duration-700 relative">
                                    <div className="absolute top-0 right-0 p-4 opacity-10">
                                        <ChefHat size={120} />
                                    </div>
                                    <h3 className="text-2xl font-black mb-4 pr-12">{recipe.name}</h3>

                                    <div className="flex gap-4 mb-6 text-sm font-bold text-gray-500">
                                        <span>⏱️ {recipe.time || '20m'}</span>
                                        <span>🔥 {recipe.calories || '450'} kcal</span>
                                    </div>

                                    <div className="mb-6">
                                        <h4 className="font-bold border-b border-gray-200 mb-2 pb-1">Ingredients Needed</h4>
                                        <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700">
                                            {ingredients.map(i => <li key={i} className="font-medium text-green-700">{i} (You have)</li>)}
                                            {/* AI should return full list, but for now we trust the prompt */}
                                            {recipe.ingredients?.filter((i: string) => !ingredients.includes(i)).map((i: string, idx: number) => (
                                                <li key={idx}>{i}</li>
                                            ))}
                                        </ul>
                                    </div>

                                    <div>
                                        <h4 className="font-bold border-b border-gray-200 mb-2 pb-1">Instructions</h4>
                                        <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">{recipe.instructions}</p>
                                    </div>

                                    <div className="mt-6 pt-4 border-t text-center">
                                        {!user ? (
                                            <p className="text-sm text-gray-500">Sign in to save recipes</p>
                                        ) : saved ? (
                                            <div className="flex items-center justify-center gap-2 text-green-600 font-bold">
                                                <Check size={18} /> Saved to Planner!
                                            </div>
                                        ) : showMealPicker ? (
                                            <div className="space-y-3">
                                                <p className="text-sm text-gray-600 font-medium">Select meal type:</p>
                                                <div className="flex flex-wrap justify-center gap-2">
                                                    {mealTypes.map((type) => (
                                                        <button
                                                            key={type}
                                                            onClick={() => saveToPlanner(type)}
                                                            disabled={saving}
                                                            className="px-4 py-2 bg-green-500 hover:bg-green-400 text-white rounded-lg text-sm font-bold transition-all disabled:opacity-50"
                                                        >
                                                            {saving ? <Loader2 className="animate-spin w-4 h-4" /> : type}
                                                        </button>
                                                    ))}
                                                </div>
                                                <button
                                                    onClick={() => setShowMealPicker(false)}
                                                    className="text-xs text-gray-400 hover:text-gray-600"
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        ) : (
                                            <button
                                                onClick={() => setShowMealPicker(true)}
                                                className="text-sm font-bold text-green-600 hover:text-green-500 flex items-center justify-center gap-1 mx-auto transition-colors"
                                            >
                                                <Sparkles size={16} /> Save to Planner
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ) : (
                                <div className="h-full flex flex-col items-center justify-center text-gray-500 border-2 border-dashed border-gray-700 rounded-2xl p-8">
                                    <ChefHat size={48} className="mb-4 opacity-50" />
                                    <p>Your recipe will appear here.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
