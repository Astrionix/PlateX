'use client';

import { useState, useEffect } from 'react';
import { Crown, Star, Zap, TrendingUp, Award } from 'lucide-react';

interface LevelSystemProps {
    totalXP?: number;
}

const LEVELS = [
    { level: 1, name: 'Beginner', minXP: 0, maxXP: 100 },
    { level: 2, name: 'Apprentice', minXP: 100, maxXP: 300 },
    { level: 3, name: 'Intermediate', minXP: 300, maxXP: 600 },
    { level: 4, name: 'Advanced', minXP: 600, maxXP: 1000 },
    { level: 5, name: 'Expert', minXP: 1000, maxXP: 1500 },
    { level: 6, name: 'Master', minXP: 1500, maxXP: 2100 },
    { level: 7, name: 'Grandmaster', minXP: 2100, maxXP: 2800 },
    { level: 8, name: 'Legend', minXP: 2800, maxXP: 3600 },
    { level: 9, name: 'Mythic', minXP: 3600, maxXP: 4500 },
    { level: 10, name: 'Nutrition God', minXP: 4500, maxXP: Infinity },
];

export default function LevelSystem({ totalXP = 450 }: LevelSystemProps) {
    const [animatedXP, setAnimatedXP] = useState(0);

    useEffect(() => {
        const timer = setTimeout(() => setAnimatedXP(totalXP), 300);
        return () => clearTimeout(timer);
    }, [totalXP]);

    const currentLevel = LEVELS.find(l => animatedXP >= l.minXP && animatedXP < l.maxXP) || LEVELS[LEVELS.length - 1];
    const nextLevel = LEVELS.find(l => l.level === currentLevel.level + 1);

    const xpInLevel = animatedXP - currentLevel.minXP;
    const xpNeeded = (nextLevel?.minXP || currentLevel.maxXP) - currentLevel.minXP;
    const progress = (xpInLevel / xpNeeded) * 100;

    const levelColors: Record<number, string> = {
        1: 'from-gray-500 to-gray-600',
        2: 'from-green-500 to-green-600',
        3: 'from-blue-500 to-blue-600',
        4: 'from-purple-500 to-purple-600',
        5: 'from-pink-500 to-pink-600',
        6: 'from-orange-500 to-orange-600',
        7: 'from-red-500 to-red-600',
        8: 'from-yellow-500 to-amber-600',
        9: 'from-cyan-500 to-teal-600',
        10: 'from-amber-400 to-yellow-500',
    };

    return (
        <div className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur border border-gray-700/50 rounded-2xl p-6">
            <div className="flex items-center gap-4 mb-4">
                {/* Level Badge */}
                <div className={`relative w-16 h-16 rounded-2xl bg-gradient-to-br ${levelColors[currentLevel.level]} flex items-center justify-center shadow-lg`}>
                    {currentLevel.level >= 10 ? (
                        <Crown className="w-8 h-8 text-white" />
                    ) : currentLevel.level >= 7 ? (
                        <Award className="w-8 h-8 text-white" />
                    ) : currentLevel.level >= 4 ? (
                        <Star className="w-8 h-8 text-white" />
                    ) : (
                        <Zap className="w-8 h-8 text-white" />
                    )}
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-gray-900 border-2 border-gray-700 flex items-center justify-center">
                        <span className="text-xs font-bold text-white">{currentLevel.level}</span>
                    </div>
                </div>

                {/* Level Info */}
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-lg font-bold text-white">{currentLevel.name}</h3>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-yellow-500/20 text-yellow-400 font-medium">
                            Lvl {currentLevel.level}
                        </span>
                    </div>
                    <p className="text-gray-400 text-sm mb-2">{animatedXP.toLocaleString()} XP Total</p>

                    {/* Progress Bar */}
                    <div className="relative">
                        <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                            <div
                                className={`h-full rounded-full bg-gradient-to-r ${levelColors[currentLevel.level]} transition-all duration-1000 ease-out`}
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                        {nextLevel && (
                            <p className="text-xs text-gray-500 mt-1">
                                {xpNeeded - xpInLevel} XP to {nextLevel.name}
                            </p>
                        )}
                    </div>
                </div>
            </div>

            {/* Recent XP Gains */}
            <div className="border-t border-gray-700/50 pt-4 mt-4">
                <p className="text-xs text-gray-500 mb-2 flex items-center gap-1">
                    <TrendingUp size={12} /> Recent XP
                </p>
                <div className="flex flex-wrap gap-2">
                    <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded-full">+50 Daily Login</span>
                    <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-1 rounded-full">+75 Meal Logged</span>
                    <span className="text-xs bg-purple-500/20 text-purple-400 px-2 py-1 rounded-full">+100 Challenge</span>
                </div>
            </div>
        </div>
    );
}
