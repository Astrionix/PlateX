'use client';

import { useState } from 'react';
import { Trophy, Flame, Zap, Target, Award, Star, Lock } from 'lucide-react';

interface Challenge {
    id: string;
    title: string;
    description: string;
    icon: any;
    color: string;
    target: number;
    current: number;
    xp: number;
    type: 'daily' | 'weekly' | 'special';
    completed: boolean;
}

export default function ChallengesQuests() {
    const [activeTab, setActiveTab] = useState<'daily' | 'weekly' | 'special'>('daily');

    const challenges: Challenge[] = [
        // Daily
        { id: '1', title: 'Log 3 Meals', description: 'Log breakfast, lunch, and dinner', icon: Target, color: 'green', target: 3, current: 1, xp: 50, type: 'daily', completed: false },
        { id: '2', title: 'Hydration Hero', description: 'Drink 8 glasses of water', icon: Zap, color: 'blue', target: 8, current: 5, xp: 30, type: 'daily', completed: false },
        { id: '3', title: 'Protein Goal', description: 'Hit your protein target', icon: Flame, color: 'purple', target: 100, current: 100, xp: 75, type: 'daily', completed: true },
        // Weekly
        { id: '4', title: '7-Day Streak', description: 'Log food for 7 consecutive days', icon: Trophy, color: 'yellow', target: 7, current: 4, xp: 200, type: 'weekly', completed: false },
        { id: '5', title: 'Veggie Champion', description: 'Eat 5 different vegetables', icon: Star, color: 'green', target: 5, current: 2, xp: 100, type: 'weekly', completed: false },
        { id: '6', title: 'Sugar-Free Week', description: 'Keep sugar under 25g daily', icon: Award, color: 'pink', target: 7, current: 1, xp: 300, type: 'weekly', completed: false },
        // Special
        { id: '7', title: 'First Analysis', description: 'Analyze your first meal', icon: Star, color: 'gold', target: 1, current: 1, xp: 100, type: 'special', completed: true },
        { id: '8', title: 'Profile Complete', description: 'Fill out all profile fields', icon: Award, color: 'purple', target: 1, current: 0, xp: 150, type: 'special', completed: false },
    ];

    const filteredChallenges = challenges.filter(c => c.type === activeTab);

    const colorClasses: Record<string, { bg: string; border: string; icon: string }> = {
        green: { bg: 'bg-green-500/10', border: 'border-green-500/30', icon: 'text-green-400' },
        blue: { bg: 'bg-blue-500/10', border: 'border-blue-500/30', icon: 'text-blue-400' },
        purple: { bg: 'bg-purple-500/10', border: 'border-purple-500/30', icon: 'text-purple-400' },
        yellow: { bg: 'bg-yellow-500/10', border: 'border-yellow-500/30', icon: 'text-yellow-400' },
        pink: { bg: 'bg-pink-500/10', border: 'border-pink-500/30', icon: 'text-pink-400' },
        gold: { bg: 'bg-amber-500/10', border: 'border-amber-500/30', icon: 'text-amber-400' },
    };

    return (
        <div className="bg-gray-800/40 backdrop-blur border border-gray-700/50 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Trophy className="text-yellow-400" /> Challenges
                </h3>
                <div className="flex gap-1 bg-gray-900/50 rounded-lg p-1">
                    {(['daily', 'weekly', 'special'] as const).map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all capitalize ${activeTab === tab
                                    ? 'bg-gradient-to-r from-green-500 to-blue-600 text-white'
                                    : 'text-gray-400 hover:text-white'
                                }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
            </div>

            <div className="space-y-3">
                {filteredChallenges.map(challenge => {
                    const colors = colorClasses[challenge.color];
                    const Icon = challenge.icon;
                    const progress = (challenge.current / challenge.target) * 100;

                    return (
                        <div
                            key={challenge.id}
                            className={`${colors.bg} border ${colors.border} rounded-xl p-4 ${challenge.completed ? 'opacity-60' : ''}`}
                        >
                            <div className="flex items-start gap-3">
                                <div className={`w-10 h-10 rounded-lg ${colors.bg} border ${colors.border} flex items-center justify-center`}>
                                    <Icon className={`w-5 h-5 ${colors.icon}`} />
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center justify-between mb-1">
                                        <h4 className="font-medium text-white text-sm">{challenge.title}</h4>
                                        <span className="text-xs font-bold text-yellow-400">+{challenge.xp} XP</span>
                                    </div>
                                    <p className="text-gray-400 text-xs mb-2">{challenge.description}</p>
                                    <div className="flex items-center gap-2">
                                        <div className="flex-1 h-1.5 bg-gray-700 rounded-full overflow-hidden">
                                            <div
                                                className={`h-full rounded-full transition-all duration-500 ${challenge.completed ? 'bg-green-500' : 'bg-gradient-to-r from-green-500 to-blue-500'}`}
                                                style={{ width: `${progress}%` }}
                                            />
                                        </div>
                                        <span className="text-xs text-gray-500">{challenge.current}/{challenge.target}</span>
                                    </div>
                                </div>
                                {challenge.completed && (
                                    <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                                        <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
