'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

interface MacroDonutProps {
    carbs: number;
    protein: number;
    fat: number;
}

export default function MacroDonut({ carbs, protein, fat }: MacroDonutProps) {
    const data = [
        { name: 'Carbs', value: carbs, color: '#3b82f6' }, // blue-500
        { name: 'Protein', value: protein, color: '#10b981' }, // emerald-500
        { name: 'Fat', value: fat, color: '#f59e0b' }, // amber-500
    ];

    return (
        <div className="h-48 w-full relative">
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                        stroke="none"
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                    </Pie>
                    <Tooltip
                        contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', color: '#fff' }}
                        itemStyle={{ color: '#fff' }}
                    />
                </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="text-center">
                    <p className="text-xs text-gray-400">Total Macros</p>
                    <p className="text-xl font-bold text-white">{Math.round(carbs + protein + fat)}g</p>
                </div>
            </div>
        </div>
    );
}
