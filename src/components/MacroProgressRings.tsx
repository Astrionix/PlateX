'use client';

import { useEffect, useState } from 'react';

interface MacroRingProps {
    label: string;
    current: number;
    target: number;
    color: string;
    unit?: string;
}

function MacroRing({ label, current, target, color, unit = 'g' }: MacroRingProps) {
    const percentage = Math.min((current / target) * 100, 100);
    const circumference = 2 * Math.PI * 40;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    const colorMap: Record<string, { stroke: string; bg: string; text: string }> = {
        green: { stroke: 'stroke-green-500', bg: 'bg-green-500/20', text: 'text-green-400' },
        blue: { stroke: 'stroke-blue-500', bg: 'bg-blue-500/20', text: 'text-blue-400' },
        yellow: { stroke: 'stroke-yellow-500', bg: 'bg-yellow-500/20', text: 'text-yellow-400' },
        red: { stroke: 'stroke-red-500', bg: 'bg-red-500/20', text: 'text-red-400' },
        purple: { stroke: 'stroke-purple-500', bg: 'bg-purple-500/20', text: 'text-purple-400' },
    };

    const colors = colorMap[color] || colorMap.green;

    return (
        <div className="flex flex-col items-center">
            <div className="relative w-24 h-24">
                <svg className="w-24 h-24 transform -rotate-90">
                    <circle
                        cx="48"
                        cy="48"
                        r="40"
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="none"
                        className="text-gray-700"
                    />
                    <circle
                        cx="48"
                        cy="48"
                        r="40"
                        strokeWidth="8"
                        fill="none"
                        strokeLinecap="round"
                        className={`${colors.stroke} transition-all duration-1000 ease-out`}
                        style={{
                            strokeDasharray: circumference,
                            strokeDashoffset: strokeDashoffset,
                        }}
                    />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className={`text-lg font-bold ${colors.text}`}>{Math.round(percentage)}%</span>
                </div>
            </div>
            <p className="text-white font-medium text-sm mt-2">{label}</p>
            <p className="text-gray-500 text-xs">{current}/{target}{unit}</p>
        </div>
    );
}

interface MacroProgressRingsProps {
    calories?: { current: number; target: number };
    protein?: { current: number; target: number };
    carbs?: { current: number; target: number };
    fat?: { current: number; target: number };
}

export default function MacroProgressRings({
    calories = { current: 0, target: 2000 },
    protein = { current: 0, target: 150 },
    carbs = { current: 0, target: 250 },
    fat = { current: 0, target: 65 }
}: MacroProgressRingsProps) {
    const [animated, setAnimated] = useState(false);

    useEffect(() => {
        setAnimated(true);
    }, []);

    return (
        <div className="bg-gray-800/40 backdrop-blur border border-gray-700/50 rounded-2xl p-6">
            <h3 className="text-lg font-bold text-white mb-6 text-center">Today's Progress</h3>
            <div className="grid grid-cols-4 gap-4">
                <MacroRing
                    label="Calories"
                    current={animated ? calories.current : 0}
                    target={calories.target}
                    color="green"
                    unit=" kcal"
                />
                <MacroRing
                    label="Protein"
                    current={animated ? protein.current : 0}
                    target={protein.target}
                    color="blue"
                />
                <MacroRing
                    label="Carbs"
                    current={animated ? carbs.current : 0}
                    target={carbs.target}
                    color="yellow"
                />
                <MacroRing
                    label="Fat"
                    current={animated ? fat.current : 0}
                    target={fat.target}
                    color="red"
                />
            </div>
        </div>
    );
}
