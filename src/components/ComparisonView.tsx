'use client';

import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Minus, ArrowRight } from 'lucide-react';

interface ComparisonData {
    label: string;
    current: number;
    previous: number;
    unit: string;
}

export default function ComparisonView() {
    const [period, setPeriod] = useState<'day' | 'week' | 'month'>('week');

    // Mock data - in real app, fetch from API
    const data: ComparisonData[] = [
        { label: 'Calories', current: 1850, previous: 2100, unit: 'kcal' },
        { label: 'Protein', current: 120, previous: 95, unit: 'g' },
        { label: 'Carbs', current: 180, previous: 220, unit: 'g' },
        { label: 'Fat', current: 55, previous: 70, unit: 'g' },
        { label: 'Water', current: 2.5, previous: 2.0, unit: 'L' },
        { label: 'Meals Logged', current: 18, previous: 14, unit: '' },
    ];

    const getChange = (current: number, previous: number) => {
        if (previous === 0) return 0;
        return ((current - previous) / previous) * 100;
    };

    const periodLabels = {
        day: { current: 'Today', previous: 'Yesterday' },
        week: { current: 'This Week', previous: 'Last Week' },
        month: { current: 'This Month', previous: 'Last Month' },
    };

    return (
        <div className="bg-gray-800/40 backdrop-blur border border-gray-700/50 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <TrendingUp className="text-green-400" /> Comparison
                </h3>
                <div className="flex gap-1 bg-gray-900/50 rounded-lg p-1">
                    {(['day', 'week', 'month'] as const).map(p => (
                        <button
                            key={p}
                            onClick={() => setPeriod(p)}
                            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all capitalize ${period === p
                                    ? 'bg-gradient-to-r from-green-500 to-blue-600 text-white'
                                    : 'text-gray-400 hover:text-white'
                                }`}
                        >
                            {p}
                        </button>
                    ))}
                </div>
            </div>

            {/* Period Labels */}
            <div className="flex justify-between text-xs text-gray-500 mb-4 px-2">
                <span>{periodLabels[period].previous}</span>
                <ArrowRight size={14} />
                <span className="text-white font-medium">{periodLabels[period].current}</span>
            </div>

            {/* Comparison Cards */}
            <div className="grid grid-cols-2 gap-3">
                {data.map((item) => {
                    const change = getChange(item.current, item.previous);
                    const isPositive = change > 0;
                    const isNeutral = change === 0;

                    // For calories, lower is usually better (unless bulking)
                    const isGood = item.label === 'Calories' ? !isPositive : isPositive;

                    return (
                        <div
                            key={item.label}
                            className="bg-gray-900/50 border border-gray-700/50 rounded-xl p-4"
                        >
                            <p className="text-xs text-gray-500 mb-1">{item.label}</p>
                            <div className="flex items-baseline gap-2">
                                <span className="text-xl font-bold text-white">
                                    {item.current}{item.unit}
                                </span>
                                <div className={`flex items-center gap-1 text-xs font-medium ${isNeutral ? 'text-gray-400' : isGood ? 'text-green-400' : 'text-red-400'
                                    }`}>
                                    {isNeutral ? (
                                        <Minus size={12} />
                                    ) : isPositive ? (
                                        <TrendingUp size={12} />
                                    ) : (
                                        <TrendingDown size={12} />
                                    )}
                                    {Math.abs(change).toFixed(0)}%
                                </div>
                            </div>
                            <p className="text-xs text-gray-600 mt-1">
                                vs {item.previous}{item.unit}
                            </p>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
