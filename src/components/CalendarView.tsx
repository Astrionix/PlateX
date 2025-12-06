'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from './AuthProvider';
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';

export default function CalendarView() {
    const { user, loading: authLoading } = useAuth();
    const [currentDate, setCurrentDate] = useState(new Date());
    const [logs, setLogs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1).getDay(); // 0 = Sun

    useEffect(() => {
        if (!authLoading) {
            if (user) {
                fetchLogs();
            } else {
                setLoading(false);
            }
        }
    }, [user, authLoading, currentDate]);

    const fetchLogs = async () => {
        setLoading(true);
        // Fetch logs for this month
        const start = new Date(year, month, 1).toISOString();
        const end = new Date(year, month + 1, 0).toISOString();

        const { data } = await supabase
            .from('food_logs')
            .select('created_at, health_score, total_calories')
            .eq('user_id', user?.id)
            .gte('created_at', start)
            .lte('created_at', end);

        setLogs(data || []);
        setLoading(false);
    };

    const getDayStatus = (day: number) => {
        const dateStr = new Date(year, month, day).toISOString().split('T')[0];
        const dayLogs = logs.filter(l => l.created_at.startsWith(dateStr));

        if (dayLogs.length === 0) return 'none';

        const avgScore = dayLogs.reduce((acc, curr) => acc + (curr.health_score || 0), 0) / dayLogs.length;

        if (avgScore >= 70) return 'good';
        if (avgScore >= 50) return 'okay';
        return 'bad';
    };

    const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));
    const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));

    const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    return (
        <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-6 h-full">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-white font-bold">{monthNames[month]} {year}</h3>
                <div className="flex gap-2">
                    <button onClick={prevMonth} className="p-1 hover:bg-gray-700 rounded-full text-gray-400 hover:text-white transition-colors"><ChevronLeft size={20} /></button>
                    <button onClick={nextMonth} className="p-1 hover:bg-gray-700 rounded-full text-gray-400 hover:text-white transition-colors"><ChevronRight size={20} /></button>
                </div>
            </div>

            {loading ? (
                <div className="h-48 flex items-center justify-center"><Loader2 className="animate-spin text-gray-500" /></div>
            ) : (
                <div className="grid grid-cols-7 gap-2 text-center text-sm">
                    {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
                        <div key={`${d}-${i}`} className="text-gray-500 font-medium mb-2">{d}</div>
                    ))}

                    {Array.from({ length: firstDay }).map((_, i) => (
                        <div key={`empty-${i}`} />
                    ))}

                    {Array.from({ length: daysInMonth }).map((_, i) => {
                        const day = i + 1;
                        const status = getDayStatus(day);
                        let bg = 'hover:bg-gray-700 text-gray-300';

                        // Status Colors
                        if (status === 'good') bg = 'bg-green-500/20 text-green-400 border border-green-500/50';
                        if (status === 'okay') bg = 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/50';
                        if (status === 'bad') bg = 'bg-red-500/20 text-red-400 border border-red-500/50';

                        // Today Highlight
                        const isToday = day === new Date().getDate() && month === new Date().getMonth() && year === new Date().getFullYear();
                        if (isToday) bg += ' ring-1 ring-white';

                        return (
                            <div
                                key={day}
                                className={`aspect-square rounded-full flex items-center justify-center cursor-pointer transition-all ${bg}`}
                                title={`${status === 'none' ? 'No logs' : `Avg Score: ${status}`}`}
                            >
                                {day}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
