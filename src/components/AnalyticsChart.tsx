'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { useAuth } from './AuthProvider';
import { Loader2 } from 'lucide-react';

export default function AnalyticsChart() {
    const { user } = useAuth();
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) fetchData();
    }, [user]);

    const fetchData = async () => {
        // Fetch last 7 days
        const { data: logs } = await supabase
            .from('food_logs')
            .select('created_at, total_calories')
            .eq('user_id', user?.id)
            .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
            .order('created_at', { ascending: true });

        if (!logs) {
            setLoading(false);
            return;
        }

        // Aggregate by day
        const grouped = logs.reduce((acc: any, log: any) => {
            const date = new Date(log.created_at).toLocaleDateString('en-US', { weekday: 'short' });
            acc[date] = (acc[date] || 0) + log.total_calories;
            return acc;
        }, {});

        // Format for Chart
        const chartData = Object.keys(grouped).map(date => ({
            name: date,
            calories: grouped[date]
        }));

        setData(chartData);
        setLoading(false);
    };

    if (loading) return <div className="h-48 flex items-center justify-center"><Loader2 className="animate-spin text-gray-500" /></div>;

    // Fallback data if empty to show the grid structure at least
    const displayData = data.length > 0 ? data : [
        { name: 'Mon', calories: 0 },
        { name: 'Tue', calories: 0 },
        { name: 'Wed', calories: 0 },
        { name: 'Thu', calories: 0 },
        { name: 'Fri', calories: 0 },
        { name: 'Sat', calories: 0 },
        { name: 'Sun', calories: 0 },
    ];

    return (
        <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-6">
            <h3 className="text-white font-bold mb-4">Calorie Trend (Last 7 Days)</h3>
            <div className="h-48 w-full min-h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={displayData}>
                        <XAxis dataKey="name" stroke="#6b7280" tick={{ fontSize: 12 }} />
                        <YAxis stroke="#6b7280" tick={{ fontSize: 12 }} />
                        <Tooltip
                            contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px' }}
                            itemStyle={{ color: '#fff' }}
                        />
                        <Bar dataKey="calories" radius={[4, 4, 0, 0]}>
                            {displayData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.calories > 2500 ? '#ef4444' : '#3b82f6'} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
