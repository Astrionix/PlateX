'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/components/AuthProvider';
import { Loader2 } from 'lucide-react';

export default function ReportPage() {
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState<any>(null);

    useEffect(() => {
        if (user) generateStats();
    }, [user]);

    const generateStats = async () => {
        // Fetch last 7 days
        const { data: logs } = await supabase
            .from('food_logs')
            .select('*')
            .eq('user_id', user?.id)
            .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
            .order('created_at', { ascending: false });

        if (!logs) {
            setLoading(false);
            return;
        }

        const totalCals = logs.reduce((acc, l) => acc + l.total_calories, 0);
        const avgCals = Math.round(totalCals / 7);
        const avgScore = Math.round(logs.reduce((acc, l) => acc + (l.health_score || 0), 0) / logs.length) || 0;

        // Group by food name to find most frequent
        const foodCounts: Record<string, number> = {};
        logs.forEach(l => {
            const name = l.food_name || 'Unknown';
            foodCounts[name] = (foodCounts[name] || 0) + 1;
        });
        const topFoods = Object.entries(foodCounts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
            .map(e => e[0]);

        setStats({
            range: 'Last 7 Days',
            avgCalories: avgCals,
            avgHealthScore: avgScore,
            totalLogs: logs.length,
            topFoods,
            logs
        });
        setLoading(false);

        // Auto print after load
        setTimeout(() => window.print(), 1000);
    };

    if (loading) return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin" /></div>;

    return (
        <div className="bg-white min-h-screen text-black p-12 print-container">
            <header className="mb-12 border-b-2 border-black pb-4 flex justify-between items-end">
                <div>
                    <h1 className="text-4xl font-black uppercase tracking-tighter mb-2">PlateX Report</h1>
                    <p className="text-gray-600">Weekly Nutrition Summary</p>
                </div>
                <div className="text-right">
                    <p className="font-bold">{new Date().toLocaleDateString()}</p>
                    <p className="text-sm text-gray-500">User: {user?.email}</p>
                </div>
            </header>

            {stats && (
                <div className="space-y-12">
                    <section className="grid grid-cols-3 gap-8">
                        <div className="bg-gray-100 p-6 rounded-xl">
                            <h3 className="text-sm font-bold uppercase text-gray-500 mb-2">Avg. Health Score</h3>
                            <p className="text-5xl font-black text-green-600">{stats.avgHealthScore}/100</p>
                        </div>
                        <div className="bg-gray-100 p-6 rounded-xl">
                            <h3 className="text-sm font-bold uppercase text-gray-500 mb-2">Avg. Daily Calories</h3>
                            <p className="text-5xl font-black text-blue-600">{stats.avgCalories}</p>
                        </div>
                        <div className="bg-gray-100 p-6 rounded-xl">
                            <h3 className="text-sm font-bold uppercase text-gray-500 mb-2">Total Meals Logged</h3>
                            <p className="text-5xl font-black text-purple-600">{stats.totalLogs}</p>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold mb-4 border-b border-gray-300 pb-2">Top Foods</h2>
                        <div className="flex flex-wrap gap-2">
                            {stats.topFoods.map((f: string, i: number) => (
                                <span key={i} className="bg-black text-white px-4 py-2 rounded-full font-medium">{f}</span>
                            ))}
                        </div>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold mb-4 border-b border-gray-300 pb-2">Detailed Logs</h2>
                        <table className="w-full text-left text-sm">
                            <thead>
                                <tr className="border-b-2 border-black">
                                    <th className="py-2">Date</th>
                                    <th className="py-2">Food</th>
                                    <th className="py-2 text-right">Calories</th>
                                    <th className="py-2 text-right">Score</th>
                                </tr>
                            </thead>
                            <tbody>
                                {stats.logs.map((log: any) => (
                                    <tr key={log.id} className="border-b border-gray-200">
                                        <td className="py-2">{new Date(log.created_at).toLocaleDateString()}</td>
                                        <td className="py-2 font-medium">{log.food_name}</td>
                                        <td className="py-2 text-right">{log.total_calories}</td>
                                        <td className="py-2 text-right font-bold">{log.health_score}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </section>

                    <footer className="mt-12 text-center text-gray-400 text-sm">
                        Generated by PlateX AI Nutrition Tracker
                    </footer>
                </div>
            )}

            <style jsx global>{`
                @media print {
                    @page { margin: 0; }
                    body { margin: 1.6cm; }
                }
            `}</style>
        </div>
    );
}
