'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from './AuthProvider';
import { Droplet, Plus, Minus } from 'lucide-react';

export default function HydrationTracker() {
    const { user } = useAuth();
    const [intake, setIntake] = useState(0);
    const [target, setTarget] = useState(2500); // Default, override with profile later
    const [percentage, setPercentage] = useState(0);

    useEffect(() => {
        if (user) {
            fetchTodayIntake();
            fetchTarget();
        }
    }, [user]);

    useEffect(() => {
        setPercentage(Math.min(100, Math.round((intake / target) * 100)));
    }, [intake, target]);

    const fetchTarget = async () => {
        // We could fetch from profile, but let's assume passed prop or fetch separately
        const { data } = await supabase.from('profiles').select('daily_water_target').eq('auth_uid', user?.id).single();
        if (data?.daily_water_target) {
            setTarget(data.daily_water_target * 1000); // L to mL
        }
    };

    const fetchTodayIntake = async () => {
        const today = new Date().toISOString().split('T')[0];
        const { data } = await supabase
            .from('water_logs')
            .select('amount_ml')
            .eq('user_id', user?.id)
            .gte('created_at', today);

        const total = data?.reduce((acc, curr) => acc + curr.amount_ml, 0) || 0;
        setIntake(total);
    };

    const addWater = async (amount: number) => {
        if (!user) return;

        // Optimistic UI
        const newIntake = intake + amount;
        if (newIntake < 0) return;
        setIntake(newIntake);

        if (amount > 0) {
            await supabase.from('water_logs').insert({ user_id: user.id, amount_ml: amount });
        } else {
            // Deleting is harder without ID, simpler to just add negative entry? 
            // Or usually water apps dont delete history easily, they just adjust totals.
            // For simplicity in this 'add' model, let's just insert negative if correcting, 
            // OR finding the last log and deleting it.
            // Let's stick to positive inserts only for now to avoid mess, 
            // BUT "undo" is requested often. 
            // Actually, let's just insert a negative record for correction if we want simple sum.
            // Or better: find last log and delete.
            const { data } = await supabase.from('water_logs').select('id').eq('user_id', user.id).order('created_at', { ascending: false }).limit(1);
            if (data && data[0]) {
                await supabase.from('water_logs').delete().eq('id', data[0].id);
                // Re-fetch to be safe
                fetchTodayIntake();
            }
        }
    };

    return (
        <div className="bg-blue-900/20 border border-blue-500/30 rounded-2xl p-6 flex flex-col items-center relative overflow-hidden h-full justify-center">
            {/* Background Animation */}
            <div
                className="absolute bottom-0 left-0 right-0 bg-blue-500/20 transition-all duration-1000 ease-in-out"
                style={{ height: `${percentage}%` }}
            />

            <div className="relative z-10 flex flex-col items-center">
                <div className="flex items-center gap-2 mb-2">
                    <Droplet className="text-blue-400 fill-blue-400" size={24} />
                    <h3 className="text-xl font-bold text-white">Hydration</h3>
                </div>

                <div className="text-4xl font-bold text-white mb-1">{intake}<span className="text-lg text-blue-300 ml-1">ml</span></div>
                <div className="text-sm text-gray-400 mb-6">Target: {target}ml</div>

                <div className="flex gap-4">
                    <button
                        onClick={() => addWater(-250)}
                        className="w-10 h-10 rounded-full bg-gray-800 border border-gray-600 flex items-center justify-center hover:bg-gray-700 transition-colors"
                    >
                        <Minus size={20} />
                    </button>
                    <button
                        onClick={() => addWater(250)}
                        className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-xl font-bold transition-all shadow-lg shadow-blue-500/20 flex items-center gap-2"
                    >
                        <Plus size={18} /> 250ml
                    </button>
                </div>
            </div>
        </div>
    );
}
