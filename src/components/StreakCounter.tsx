'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Flame, Trophy } from 'lucide-react';
import { useAuth } from './AuthProvider';

export default function StreakCounter() {
    const { user } = useAuth();
    const [streak, setStreak] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) calculateStreak();
    }, [user]);

    const calculateStreak = async () => {
        // Fetch last 30 days of logs just to check dates
        const { data } = await supabase
            .from('food_logs')
            .select('created_at')
            .eq('user_id', user?.id)
            .order('created_at', { ascending: false })
            .limit(100);

        if (!data || data.length === 0) {
            setStreak(0);
            setLoading(false);
            return;
        }

        // Get unique dates (YYYY-MM-DD)
        const uniqueDates = Array.from(new Set(data.map(log => log.created_at.split('T')[0])));

        // Calculate consecutive days backwards from today or yesterday
        let currentStreak = 0;
        const today = new Date().toISOString().split('T')[0];
        const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

        // Check if user logged today
        let checkDate = new Date();
        if (!uniqueDates.includes(today)) {
            // If not logged today, start checking from yesterday to see if streak is active/frozen
            // For strict streak, if not today/yesterday, it's 0.
            if (!uniqueDates.includes(yesterday)) {
                setStreak(0);
                setLoading(false);
                return;
            }
            checkDate = new Date(Date.now() - 86400000);
        }

        // Simple loop to count backwards
        // Actually, simpler logic:
        // Sort dates descending.
        // Check if date[0] is today or yesterday.
        // Then check if date[i] is 1 day before date[i-1].

        const sortedDates = uniqueDates.sort((a, b) => b.localeCompare(a));

        // If most recent log is older than yesterday, streak is broken
        if (sortedDates[0] < yesterday) {
            setStreak(0);
        } else {
            currentStreak = 1;
            let lastDate = new Date(sortedDates[0]);

            for (let i = 1; i < sortedDates.length; i++) {
                const thisDate = new Date(sortedDates[i]);
                const diffTime = Math.abs(lastDate.getTime() - thisDate.getTime());
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                if (diffDays === 1) {
                    currentStreak++;
                    lastDate = thisDate;
                } else {
                    break;
                }
            }
            setStreak(currentStreak);
        }

        setLoading(false);
    };

    if (loading) return null; // Keep loading hidden or show spinner, but show 0 streak

    return (
        <div className="animate-in fade-in zoom-in duration-500">
            <div className="flex items-center gap-2 bg-orange-500/20 backdrop-blur-md border border-orange-500/50 px-4 py-2 rounded-full shadow-lg shadow-orange-500/20">
                <div className="relative">
                    <Flame className="text-orange-500 fill-orange-500 animate-pulse" size={24} />
                    <div className="absolute inset-0 bg-orange-400 blur-lg opacity-50 animate-pulse"></div>
                </div>
                <div>
                    <span className="text-2xl font-black text-white italic tracking-tighter">{streak}</span>
                    <span className="text-xs text-orange-200 font-bold ml-1 uppercase">Day Streak</span>
                </div>
            </div>
        </div>
    );
}
