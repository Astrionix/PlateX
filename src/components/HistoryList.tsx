'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Loader2, Clock } from 'lucide-react';

interface FoodLog {
    id: string;
    image_url: string;
    total_calories: number;
    health_score: number;
    created_at: string;
    ingredients: any[];
    total_carbs: number;
    total_protein: number;
    total_fat: number;
    total_fiber?: number;
    total_sugar?: number;
    glycemic_load?: string;
    warnings?: string[];
}

interface HistoryListProps {
    onSelect: (log: FoodLog) => void;
    refreshTrigger: number;
}

export default function HistoryList({ onSelect, refreshTrigger }: HistoryListProps) {
    const [logs, setLogs] = useState<FoodLog[]>([]);
    const [loading, setLoading] = useState(true);

    async function fetchLogs() {
        try {
            const { data, error } = await supabase
                .from('food_logs')
                .select('*')
                .order('created_at', { ascending: false })
                .limit(10);

            if (error) throw error;
            if (data) setLogs(data);
        } catch (error) {
            console.error('Error fetching history:', error);
        } finally {
            setLoading(false);
        }
    }

    // Effect with Cleanup
    useEffect(() => {
        let mounted = true;

        const load = async () => {
            try {
                const { data, error } = await supabase
                    .from('food_logs')
                    .select('*')
                    .order('created_at', { ascending: false })
                    .limit(10);

                if (mounted) {
                    if (data) setLogs(data);
                }
            } catch (error) {
                console.error(error);
            } finally {
                if (mounted) setLoading(false);
            }
        };

        load();

        return () => { mounted = false; };
    }, [refreshTrigger]);

    if (loading) return <div className="flex justify-center p-4"><Loader2 className="animate-spin text-gray-400" /></div>;
    if (logs.length === 0) return (
        <div className="text-gray-500 text-sm text-center py-4">No recent scans</div>
    );

    return (
        <div className="w-full space-y-3">
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2 px-1">Recent Scans</h3>
            {logs.map((log) => (
                <div
                    key={log.id}
                    onClick={() => onSelect(log)}
                    className="bg-gray-800/40 border border-gray-700/50 rounded-lg overflow-hidden hover:bg-gray-800/80 transition-all group flex items-center gap-3 p-2 cursor-pointer active:scale-95"
                >
                    <div className="w-12 h-12 rounded-md overflow-hidden flex-shrink-0 relative bg-gray-700/50 flex items-center justify-center">
                        {log.image_url ? (
                            <img src={log.image_url} alt="Food" className="w-full h-full object-cover" />
                        ) : (
                            <div className="text-xs text-gray-500">Log</div>
                        )}
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-0.5">
                            <span className="text-sm font-medium text-white truncate">{log.total_calories} kcal</span>
                            <span className={`text-xs font-bold px-1.5 py-0.5 rounded ${log.health_score >= 7 ? 'bg-green-500/20 text-green-400' :
                                log.health_score >= 4 ? 'bg-yellow-500/20 text-yellow-400' :
                                    'bg-red-500/20 text-red-400'
                                }`}>
                                {log.health_score}
                            </span>
                        </div>
                        <div className="flex items-center text-xs text-gray-500">
                            <Clock className="w-3 h-3 mr-1" />
                            {new Date(log.created_at).toLocaleDateString()}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
