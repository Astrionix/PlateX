'use client';

import { useState, useRef } from 'react';
import MacroDonut from './MacroDonut';
import BloodSugarChart from './BloodSugarChart';
import { AlertTriangle, ChefHat, Clock, Flame, Loader2, X, Activity, Share2, Download, ShoppingCart, Check } from 'lucide-react';
import html2canvas from 'html2canvas';
import { supabase } from '@/lib/supabaseClient';

interface Ingredient {
    name: string;
    category: string;
    portion_estimate?: string;
    grams: number;
    calories: number;
    carbs: number;
    protein: number;
    fat: number;
    fiber?: number;
    sugar?: number;
}

interface Result {
    image_url: string;
    total_calories: number;
    total_carbs: number;
    total_protein: number;
    total_fat: number;
    total_fiber?: number;
    total_sugar?: number;
    health_score: number;
    glycemic_load?: string;
    warnings?: string[];
    ingredients: Ingredient[];
}

interface Recipe {
    name: string;
    description: string;
    prep_time: string;
    cook_time: string;
    calories: number;
    ingredients: string[];
    instructions: string[];
}

interface ResultsCardProps {
    result: Result;
    onReset: () => void;
}

export default function ResultsCard({ result, onReset }: ResultsCardProps) {
    const [recipe, setRecipe] = useState<Recipe | null>(null);
    const [loadingRecipe, setLoadingRecipe] = useState(false);
    const cardRef = useRef<HTMLDivElement>(null);
    const [isSharing, setIsSharing] = useState(false);
    const [addingToCart, setAddingToCart] = useState(false);
    const [addedToCart, setAddedToCart] = useState(false);

    const handleAddToCart = async () => {
        setAddingToCart(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                alert("Please sign in to use the shopping list.");
                return;
            }

            if (!recipe) return;

            const itemsToAdd = recipe.ingredients.map(ing => ({
                user_id: user.id,
                item: ing
            }));

            const { error } = await supabase.from('shopping_list').insert(itemsToAdd);

            if (error) throw error;

            setAddedToCart(true);
            setTimeout(() => setAddedToCart(false), 3000);
        } catch (err) {
            console.error("Cart error:", err);
            alert("Failed to add to list.");
        } finally {
            setAddingToCart(false);
        }
    };

    if (!result || !result.ingredients) {
        return <div className="text-red-500 p-4">Error: Invalid result data. Please try again.</div>;
    }

    const handleGenerateRecipe = async () => {
        setLoadingRecipe(true);
        try {
            const ingredientNames = result.ingredients.map(i => i.name);
            const res = await fetch('/api/suggest-recipe', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ingredients: ingredientNames })
            });
            const data = await res.json();
            if (res.ok) {
                setRecipe(data);
            } else {
                alert("Couldn't generate recipe. Try again.");
            }
        } catch (error) {
            console.error(error);
            alert("Error generating recipe.");
        } finally {
            setLoadingRecipe(false);
        }
    };

    const handleShare = async () => {
        if (!cardRef.current) return;
        setIsSharing(true);
        try {
            // Add a small delay to ensure rendering catches up if needed
            await new Promise(resolve => setTimeout(resolve, 100));

            const canvas = await html2canvas(cardRef.current, {
                useCORS: true,
                backgroundColor: '#111827', // dark bg hex code for gray-900 (approx)
                scale: 2 // high res
            });

            const image = canvas.toDataURL("image/png");
            const link = document.createElement('a');
            link.href = image;
            link.download = `platex-meal-${Date.now()}.png`;
            link.click();
        } catch (err) {
            console.error("Share error:", err);
            alert("Failed to create image.");
        } finally {
            setIsSharing(false);
        }
    };

    return (
        <div ref={cardRef} className="w-full max-w-5xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 relative p-4 rounded-xl">
            {/* Floating Action Buttons - Absolute to the container */}
            <div className="absolute top-0 right-0 z-20" data-html2canvas-ignore="true">
                <button
                    onClick={handleShare}
                    disabled={isSharing}
                    className="p-2 bg-gray-800/80 hover:bg-blue-600 text-white rounded-lg transition-colors border border-gray-600 hover:border-blue-500 shadow-lg"
                    title="Download Summary"
                >
                    {isSharing ? <Loader2 className="animate-spin w-5 h-5" /> : <Download size={20} />}
                </button>
            </div>

            {/* Main Analysis Card */}
            <div className="bg-gray-900/50 backdrop-blur-md border border-gray-700 rounded-2xl p-6 shadow-2xl relative">

                <div className="grid lg:grid-cols-2 gap-8">
                    {/* Left Column: Image & Score */}
                    <div className="space-y-6">
                        <div className="relative rounded-xl overflow-hidden shadow-lg aspect-video group bg-gray-800 flex items-center justify-center">
                            {result.image_url ? (
                                <img
                                    src={result.image_url}
                                    alt="Analyzed Food"
                                    crossOrigin="anonymous"
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                            ) : (
                                <div className="text-gray-500 flex flex-col items-center">
                                    <span className="text-sm">No Image Available</span>
                                </div>
                            )}
                            <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-sm px-3 py-1 rounded-full border border-white/10">
                                <span className="text-sm font-medium text-white">Health Score: </span>
                                <span className={`font-bold ${result.health_score >= 80 ? 'text-green-400' :
                                    result.health_score >= 50 ? 'text-yellow-400' : 'text-red-400'
                                    }`}>{result.health_score}/100</span>
                            </div>
                        </div>

                        {/* Insights Panel */}
                        <div className="space-y-4">
                            <BloodSugarChart glycemicLoad={result.glycemic_load || 'Medium'} />

                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
                                    <h4 className="text-sm text-gray-400 mb-1 flex items-center gap-2">
                                        <AlertTriangle size={14} className="text-orange-400" /> Warnings
                                    </h4>
                                    {result.warnings && result.warnings.length > 0 ? (
                                        <div className="flex flex-wrap gap-1">
                                            {result.warnings.map((w, i) => (
                                                <span key={i} className="text-xs bg-red-500/10 text-red-300 px-2 py-0.5 rounded border border-red-500/20">{w}</span>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-sm text-green-400">None detected</p>
                                    )}
                                </div>

                                <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700 flex flex-col justify-center items-center">
                                    <span className="text-sm text-gray-400">Glycemic Load</span>
                                    <span className={`text-xl font-bold ${result.glycemic_load === 'Low' ? 'text-green-400' :
                                        result.glycemic_load === 'Medium' ? 'text-yellow-400' : 'text-red-400'
                                        }`}>{result.glycemic_load || 'N/A'}</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
                            <h3 className="text-lg font-semibold text-white mb-4">Macronutrients</h3>
                            <div className="flex items-center justify-between">
                                <MacroDonut
                                    carbs={result.total_carbs}
                                    protein={result.total_protein}
                                    fat={result.total_fat}
                                />
                                <div className="space-y-3 text-sm min-w-[140px]">
                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center gap-2">
                                            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                                            <span className="text-gray-300">Carbs</span>
                                        </div>
                                        <span className="font-bold text-white">{result.total_carbs}g</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center gap-2">
                                            <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                                            <span className="text-gray-300">Protein</span>
                                        </div>
                                        <span className="font-bold text-white">{result.total_protein}g</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center gap-2">
                                            <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                                            <span className="text-gray-300">Fat</span>
                                        </div>
                                        <span className="font-bold text-white">{result.total_fat}g</span>
                                    </div>
                                    <div className="pt-2 border-t border-gray-700 mt-2 flex justify-between items-center">
                                        <span className="text-gray-400">Total</span>
                                        <span className="text-white font-bold text-lg">{result.total_calories} kcal</span>
                                    </div>
                                </div>
                            </div>

                            {/* Micro-nutrients row */}
                            <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-gray-700/50">
                                <div className="text-center">
                                    <span className="text-xs text-gray-500 uppercase tracking-wider">Fiber</span>
                                    <p className="text-white font-bold">{result.total_fiber || 0}g</p>
                                </div>
                                <div className="text-center">
                                    <span className="text-xs text-gray-500 uppercase tracking-wider">Sugar</span>
                                    <p className="text-white font-bold">{result.total_sugar || 0}g</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Ingredients */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="text-xl font-bold text-white">Plate Breakdown</h3>
                            <button onClick={onReset} className="text-sm bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg transition-colors shadow-lg shadow-blue-500/20">
                                Scan New Meal
                            </button>
                        </div>

                        <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                            {result.ingredients.map((item, idx) => (
                                <div key={idx} className="bg-gray-800/40 border border-gray-700/50 rounded-xl p-4 hover:bg-gray-800/60 transition-colors group">
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <h4 className="font-bold text-white text-lg capitalize group-hover:text-blue-300 transition-colors">{item.name}</h4>
                                            <p className="text-sm text-gray-400">{item.portion_estimate || `${item.grams}g`}</p>
                                        </div>
                                        <span className="text-xs px-2.5 py-1 rounded-full bg-gray-700 text-gray-300 border border-gray-600 font-medium">
                                            {item.category}
                                        </span>
                                    </div>

                                    <div className="grid grid-cols-5 gap-2 text-xs text-gray-400 mt-3 bg-gray-900/30 p-2 rounded-lg">
                                        <div className="text-center">
                                            <span className="block text-gray-500 mb-1">Cals</span>
                                            <span className="text-white font-bold">{item.calories}</span>
                                        </div>
                                        <div className="text-center border-l border-gray-700">
                                            <span className="block text-blue-400 mb-1">Carbs</span>
                                            <span className="text-white">{item.carbs}g</span>
                                        </div>
                                        <div className="text-center border-l border-gray-700">
                                            <span className="block text-emerald-400 mb-1">Prot</span>
                                            <span className="text-white">{item.protein}g</span>
                                        </div>
                                        <div className="text-center border-l border-gray-700">
                                            <span className="block text-amber-400 mb-1">Fat</span>
                                            <span className="text-white">{item.fat}g</span>
                                        </div>
                                        <div className="text-center border-l border-gray-700">
                                            <span className="block text-purple-400 mb-1">Fiber</span>
                                            <span className="text-white">{item.fiber || 0}g</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Chef's Suggestion Button */}
                        {!recipe && (
                            <div className="pt-4 border-t border-gray-700/50">
                                <button
                                    onClick={handleGenerateRecipe}
                                    disabled={loadingRecipe}
                                    data-html2canvas-ignore="true"
                                    className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-400 hover:to-red-500 text-white rounded-xl p-4 flex items-center justify-center gap-3 transition-all hover:scale-[1.02] shadow-lg shadow-orange-500/20 disabled:opacity-50 disabled:hover:scale-100"
                                >
                                    {loadingRecipe ? (
                                        <><Loader2 className="animate-spin" /> Cooking up ideas...</>
                                    ) : (
                                        <><ChefHat className="animate-bounce-slow" /> Generate Healthy Recipe with these Ingredients</>
                                    )}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Generated Recipe Card */}
            {recipe && (
                <div className="bg-gray-800/30 backdrop-blur-md border border-orange-500/30 rounded-2xl p-6 shadow-2xl animate-in fade-in slide-in-from-bottom-8 duration-700">
                    <div className="flex flex-col md:flex-row gap-8">
                        <div className="flex-1 space-y-4">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-3 bg-orange-500/20 rounded-full">
                                    <ChefHat className="text-orange-400 w-8 h-8" />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-bold text-white">{recipe.name}</h3>
                                    <p className="text-gray-400 text-sm italic">{recipe.description}</p>
                                </div>
                            </div>

                            <div className="flex gap-4 text-sm mt-4">
                                <div className="flex items-center gap-2 bg-gray-900/50 px-3 py-1.5 rounded-lg border border-gray-700">
                                    <Clock size={16} className="text-blue-400" />
                                    <span className="text-gray-300">Prep: <span className="text-white font-semibold">{recipe.prep_time}</span></span>
                                </div>
                                <div className="flex items-center gap-2 bg-gray-900/50 px-3 py-1.5 rounded-lg border border-gray-700">
                                    <Flame size={16} className="text-red-400" />
                                    <span className="text-gray-300">Cook: <span className="text-white font-semibold">{recipe.cook_time}</span></span>
                                </div>
                                <div className="flex items-center gap-2 bg-gray-900/50 px-3 py-1.5 rounded-lg border border-gray-700">
                                    <Activity size={16} className="text-green-400" />
                                    <span className="text-gray-300">Cals: <span className="text-white font-semibold">{recipe.calories}</span></span>
                                </div>
                            </div>

                            <div className="mt-6">
                                <h4 className="font-semibold text-white mb-3">Instructions</h4>
                                <ol className="space-y-3">
                                    {recipe.instructions.map((step, idx) => (
                                        <li key={idx} className="flex gap-4 text-gray-300">
                                            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-orange-500/20 text-orange-400 flex items-center justify-center text-xs font-bold mt-0.5">{idx + 1}</span>
                                            <span>{step}</span>
                                        </li>
                                    ))}
                                </ol>
                            </div>
                        </div>

                        <div className="md:w-1/3 bg-gray-900/30 rounded-xl p-5 border border-gray-700/50 h-fit">
                            <div className="flex justify-between items-center mb-4">
                                <h4 className="font-semibold text-white">Ingredients Needed</h4>
                                <div className="flex gap-2">
                                    <button
                                        onClick={handleAddToCart}
                                        disabled={addingToCart || addedToCart}
                                        className={`p-1.5 rounded-lg transition-colors ${addedToCart
                                                ? 'bg-green-500/20 text-green-400'
                                                : 'bg-blue-600/20 text-blue-400 hover:bg-blue-600/30'
                                            }`}
                                        title="Add to Shopping List"
                                    >
                                        {addingToCart ? <Loader2 size={16} className="animate-spin" /> : addedToCart ? <Check size={16} /> : <ShoppingCart size={16} />}
                                    </button>
                                    <button onClick={() => setRecipe(null)} className="text-gray-500 hover:text-white"><X size={20} /></button>
                                </div>
                            </div>

                            <ul className="space-y-2 text-sm text-gray-400">
                                {recipe.ingredients.map((ing, idx) => (
                                    <li key={idx} className="flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-orange-500/50"></div>
                                        {ing}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
