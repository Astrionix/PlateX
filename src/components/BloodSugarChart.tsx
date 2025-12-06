'use client';

import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine, Area, AreaChart } from 'recharts';

interface BloodSugarChartProps {
    glycemicLoad: string;
}

export default function BloodSugarChart({ glycemicLoad }: BloodSugarChartProps) {
    // Generate data based on GL
    const getData = () => {
        const baseline = 85;
        let peak = 110;
        let color = '#4ade80'; // green-400
        let gradientId = 'colorGreen';

        if (glycemicLoad === 'Medium') {
            peak = 145;
            color = '#facc15'; // yellow-400
            gradientId = 'colorYellow';
        } else if (glycemicLoad === 'High') {
            peak = 190;
            color = '#f87171'; // red-400
            gradientId = 'colorRed';
        }

        const data = [];
        for (let i = 0; i <= 120; i += 10) {
            let value = baseline;
            // Simulate a glucose curve
            if (i <= 45) {
                // Rising phase (faster rise)
                const progress = i / 45;
                value = baseline + (peak - baseline) * Math.sin(progress * (Math.PI / 2));
            } else {
                // Falling phase (slower fall)
                const progress = (i - 45) / 75;
                value = peak - (peak - baseline) * Math.sin(progress * (Math.PI / 2));
            }
            data.push({ time: i, glucose: Math.round(value) });
        }
        return { data, color, gradientId };
    };

    const { data, color, gradientId } = getData();

    return (
        <div className="h-56 w-full bg-gray-900/50 rounded-xl p-4 border border-gray-700/50 backdrop-blur-sm">
            <div className="flex justify-between items-center mb-2">
                <div>
                    <h4 className="text-sm font-semibold text-gray-200">Blood Sugar Impact</h4>
                    <p className="text-xs text-gray-500">Predicted 2-hour glucose response</p>
                </div>
                <div className={`text-xs font-bold px-2 py-1 rounded border ${glycemicLoad === 'Low' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                        glycemicLoad === 'Medium' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' :
                            'bg-red-500/10 text-red-400 border-red-500/20'
                    }`}>
                    {glycemicLoad} Impact
                </div>
            </div>

            <div className="h-40 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data}>
                        <defs>
                            <linearGradient id="colorGreen" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#4ade80" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#4ade80" stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id="colorYellow" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#facc15" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#facc15" stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id="colorRed" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#f87171" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#f87171" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <XAxis
                            dataKey="time"
                            stroke="#4b5563"
                            fontSize={10}
                            tickLine={false}
                            axisLine={false}
                            tickFormatter={(val) => `${val}m`}
                            interval={2}
                        />
                        <YAxis
                            hide
                            domain={[60, 'auto']}
                        />
                        <Tooltip
                            contentStyle={{ backgroundColor: '#111827', border: '1px solid #374151', borderRadius: '8px', color: '#fff' }}
                            itemStyle={{ color: color }}
                            labelStyle={{ color: '#9ca3af' }}
                            formatter={(value: number) => [`${value} mg/dL`, 'Glucose']}
                            labelFormatter={(label) => `${label} min`}
                        />
                        <ReferenceLine y={140} stroke="#ef4444" strokeDasharray="3 3" strokeOpacity={0.4} />
                        <Area
                            type="monotone"
                            dataKey="glucose"
                            stroke={color}
                            strokeWidth={3}
                            fillOpacity={1}
                            fill={`url(#${gradientId})`}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
