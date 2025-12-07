'use client';

import { useState } from 'react';
import { Smile, Meh, Frown, Zap, Moon, Coffee, Battery } from 'lucide-react';

interface MoodEntry {
    mood: string;
    energy: number;
    timestamp: Date;
    notes?: string;
}

const moods = [
    { id: 'great', label: 'Great', icon: Smile, color: 'green' },
    { id: 'good', label: 'Good', icon: Smile, color: 'blue' },
    { id: 'okay', label: 'Okay', icon: Meh, color: 'yellow' },
    { id: 'tired', label: 'Tired', icon: Moon, color: 'purple' },
    { id: 'low', label: 'Low', icon: Frown, color: 'red' },
];

const energyLevels = [
    { level: 1, label: 'Very Low', color: 'red' },
    { level: 2, label: 'Low', color: 'orange' },
    { level: 3, label: 'Moderate', color: 'yellow' },
    { level: 4, label: 'Good', color: 'blue' },
    { level: 5, label: 'High', color: 'green' },
];

export default function FoodMoodTracker() {
    const [selectedMood, setSelectedMood] = useState<string | null>(null);
    const [energy, setEnergy] = useState(3);
    const [notes, setNotes] = useState('');
    const [saved, setSaved] = useState(false);

    const handleSave = () => {
        if (!selectedMood) return;

        // In real app, save to database
        const entry: MoodEntry = {
            mood: selectedMood,
            energy,
            timestamp: new Date(),
            notes: notes || undefined
        };

        console.log('Saving mood entry:', entry);
        setSaved(true);
        setTimeout(() => {
            setSaved(false);
            setSelectedMood(null);
            setNotes('');
        }, 2000);
    };

    const colorClasses: Record<string, { bg: string; border: string; text: string }> = {
        green: { bg: 'bg-green-500/20', border: 'border-green-500', text: 'text-green-400' },
        blue: { bg: 'bg-blue-500/20', border: 'border-blue-500', text: 'text-blue-400' },
        yellow: { bg: 'bg-yellow-500/20', border: 'border-yellow-500', text: 'text-yellow-400' },
        purple: { bg: 'bg-purple-500/20', border: 'border-purple-500', text: 'text-purple-400' },
        red: { bg: 'bg-red-500/20', border: 'border-red-500', text: 'text-red-400' },
        orange: { bg: 'bg-orange-500/20', border: 'border-orange-500', text: 'text-orange-400' },
    };

    return (
        <div className="bg-gray-800/40 backdrop-blur border border-gray-700/50 rounded-2xl p-6">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Coffee className="text-orange-400" /> How are you feeling?
            </h3>

            {saved ? (
                <div className="text-center py-8">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-500/20 flex items-center justify-center">
                        <svg className="w-8 h-8 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <p className="text-green-400 font-medium">Mood logged!</p>
                    <p className="text-gray-500 text-sm">We'll track patterns over time</p>
                </div>
            ) : (
                <>
                    {/* Mood Selection */}
                    <div className="mb-6">
                        <p className="text-gray-400 text-sm mb-3">Mood after eating</p>
                        <div className="flex gap-2">
                            {moods.map(mood => {
                                const Icon = mood.icon;
                                const colors = colorClasses[mood.color];
                                const isSelected = selectedMood === mood.id;

                                return (
                                    <button
                                        key={mood.id}
                                        onClick={() => setSelectedMood(mood.id)}
                                        className={`flex-1 flex flex-col items-center gap-2 p-3 rounded-xl border transition-all ${isSelected
                                                ? `${colors.bg} ${colors.border}`
                                                : 'border-gray-700 hover:border-gray-600'
                                            }`}
                                    >
                                        <Icon className={`w-6 h-6 ${isSelected ? colors.text : 'text-gray-500'}`} />
                                        <span className={`text-xs font-medium ${isSelected ? colors.text : 'text-gray-400'}`}>
                                            {mood.label}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Energy Level */}
                    <div className="mb-6">
                        <p className="text-gray-400 text-sm mb-3 flex items-center gap-2">
                            <Battery className="w-4 h-4" /> Energy Level
                        </p>
                        <div className="flex gap-2">
                            {energyLevels.map(level => {
                                const colors = colorClasses[level.color];
                                const isSelected = energy === level.level;

                                return (
                                    <button
                                        key={level.level}
                                        onClick={() => setEnergy(level.level)}
                                        className={`flex-1 py-2 rounded-lg border transition-all text-xs font-medium ${isSelected
                                                ? `${colors.bg} ${colors.border} ${colors.text}`
                                                : 'border-gray-700 text-gray-500 hover:border-gray-600'
                                            }`}
                                    >
                                        {level.level}
                                    </button>
                                );
                            })}
                        </div>
                        <p className="text-center text-xs text-gray-500 mt-2">
                            {energyLevels.find(l => l.level === energy)?.label}
                        </p>
                    </div>

                    {/* Notes */}
                    <div className="mb-4">
                        <textarea
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder="Any notes? (bloated, energized, sluggish...)"
                            className="w-full bg-gray-900/50 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:border-gray-600 text-sm resize-none h-20"
                        />
                    </div>

                    {/* Save Button */}
                    <button
                        onClick={handleSave}
                        disabled={!selectedMood}
                        className="w-full py-3 rounded-xl font-bold text-sm bg-gradient-to-r from-green-500 to-blue-600 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:from-green-400 hover:to-blue-500 transition-all"
                    >
                        Log Mood
                    </button>
                </>
            )}
        </div>
    );
}
