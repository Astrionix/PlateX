'use client';

import { useState, useEffect } from 'react';
import { Flame, Snowflake, Gift, Zap } from 'lucide-react';

interface StreakBonusProps {
    currentStreak: number;
}

export default function StreakBonus({ currentStreak = 7 }: StreakBonusProps) {
    const [showBonus, setShowBonus] = useState(false);
    const [freezeTokens, setFreezeTokens] = useState(2);

    // Milestone rewards
    const milestones = [
        { days: 7, bonus: '+100 XP', icon: Flame, color: 'orange' },
        { days: 14, bonus: '+200 XP', icon: Flame, color: 'red' },
        { days: 30, bonus: '+500 XP + Badge', icon: Gift, color: 'purple' },
        { days: 60, bonus: '+1000 XP + Title', icon: Zap, color: 'yellow' },
        { days: 100, bonus: 'Legendary Status', icon: Zap, color: 'cyan' },
    ];

    const nextMilestone = milestones.find(m => m.days > currentStreak);
    const daysToNext = nextMilestone ? nextMilestone.days - currentStreak : 0;

    const useFreezeToken = () => {
        if (freezeTokens > 0) {
            setFreezeTokens(prev => prev - 1);
            // In real app, save to database
        }
    };

    return (
        <div className="bg-gradient-to-br from-orange-900/40 to-red-900/40 backdrop-blur border border-orange-500/30 rounded-2xl p-5">
            {/* Current Streak */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center shadow-lg">
                        <Flame className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-white">{currentStreak} days</p>
                        <p className="text-xs text-gray-400">Current streak</p>
                    </div>
                </div>
                <div className="text-right">
                    <p className="text-sm text-orange-400 font-medium">Daily Bonus</p>
                    <p className="text-lg font-bold text-white">+{10 + currentStreak * 2} XP</p>
                </div>
            </div>

            {/* Next Milestone Progress */}
            {nextMilestone && (
                <div className="mb-4">
                    <div className="flex justify-between text-xs text-gray-400 mb-2">
                        <span>Next milestone: {nextMilestone.days} days</span>
                        <span>{daysToNext} days left</span>
                    </div>
                    <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                        <div
                            className="h-full rounded-full bg-gradient-to-r from-orange-500 to-red-500 transition-all duration-500"
                            style={{ width: `${(currentStreak / nextMilestone.days) * 100}%` }}
                        />
                    </div>
                    <p className="text-xs text-orange-300 mt-2">
                        🎁 Reward: {nextMilestone.bonus}
                    </p>
                </div>
            )}

            {/* Freeze Tokens */}
            <div className="flex items-center justify-between p-3 bg-gray-900/50 rounded-xl border border-gray-700/50">
                <div className="flex items-center gap-2">
                    <Snowflake className="text-blue-400" size={18} />
                    <div>
                        <p className="text-sm font-medium text-white">Streak Freezes</p>
                        <p className="text-xs text-gray-500">Skip a day without losing streak</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-blue-400">{freezeTokens}</span>
                    <button
                        onClick={useFreezeToken}
                        disabled={freezeTokens === 0}
                        className="text-xs bg-blue-500/20 text-blue-300 px-3 py-1 rounded-lg hover:bg-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                        Use
                    </button>
                </div>
            </div>
        </div>
    );
}
