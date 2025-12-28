
'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Moon, Sun, AlertCircle } from 'lucide-react';
import { useAuth } from '@/components/AuthProvider';

export default function BioRhythmSync({ onUpdate }: { onUpdate: (adjustment: number) => void }) {
    const [sleepHours, setSleepHours] = useState(7);
    const [stressLevel, setStressLevel] = useState(3); // 1-10
    const [applied, setApplied] = useState(false);

    const checkBioRhythm = () => {
        let adjustment = 0; // Negative means reduce targets, positive might mean increase recovery food

        if (sleepHours < 6) {
            adjustment = -10; // Reduce deficit, or increase maintenance to prevent chopping muscle
        }
        if (stressLevel > 7) {
            adjustment = -5; // Reduce hard-to-digest foods (simplified logic)
        }

        // This is a simplified "adjustment factor"
        // In a real app, this would recalculate the entire macro split.
        onUpdate(adjustment);
        setApplied(true);
    };

    return (
        <div className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700/50 mb-6">
            <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-blue-500/20 rounded-lg text-blue-400">
                    <Moon size={20} />
                </div>
                <h3 className="text-lg font-bold text-white">Bio-Rhythm Sync</h3>
                <span className="bg-gradient-to-r from-purple-500 to-blue-500 text-[10px] font-bold px-2 py-0.5 rounded text-white ml-auto">PRO</span>
            </div>

            {!applied ? (
                <>
                    <div className="space-y-4 mb-4">
                        <div>
                            <label className="text-xs text-gray-400 block mb-2">Hours Slept Last Night: <span className="text-white font-bold">{sleepHours}h</span></label>
                            <input
                                type="range" min="3" max="12" step="0.5"
                                value={sleepHours} onChange={(e) => setSleepHours(parseFloat(e.target.value))}
                                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                            />
                        </div>
                        <div>
                            <label className="text-xs text-gray-400 block mb-2">Stress Level (1-10): <span className="text-white font-bold">{stressLevel}</span></label>
                            <input
                                type="range" min="1" max="10" step="1"
                                value={stressLevel} onChange={(e) => setStressLevel(parseFloat(e.target.value))}
                                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-red-500"
                            />
                        </div>
                    </div>
                    <button
                        onClick={checkBioRhythm}
                        className="w-full py-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-white text-sm font-medium transition-colors"
                    >
                        Sync & Adjust Plan
                    </button>
                </>
            ) : (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-blue-900/20 border border-blue-500/30 rounded-xl p-4">
                    <div className="flex items-start gap-3">
                        <AlertCircle className="text-blue-400 w-5 h-5 flex-shrink-0" />
                        <div>
                            <p className="text-sm text-white font-medium mb-1">Plan Adjusted</p>
                            <p className="text-xs text-gray-400">
                                {sleepHours < 6
                                    ? "Due to low sleep, we've increased your recovery protein and reduced glycemic load to prevent energy crashes."
                                    : "Sleep is optimal! We've set your targets to maximum performance mode."}
                            </p>
                            <button onClick={() => setApplied(false)} className="text-xs text-blue-400 mt-2 underline">Edit</button>
                        </div>
                    </div>
                </motion.div>
            )}
        </div>
    );
}
