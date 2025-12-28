
'use client';

import { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import BodyProjector from '@/components/BodyProjector';
import { Play, TrendingDown, Calendar, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function BodyTrackerPage() {
    const [months, setMonths] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);

    // Mock Profile Data
    const currentWeight = 85;
    const goalWeight = 70;

    const togglePlay = () => {
        if (isPlaying) {
            setIsPlaying(false);
            return;
        }
        setIsPlaying(true);
        let m = months;
        const interval = setInterval(() => {
            if (m >= 12) {
                clearInterval(interval);
                setIsPlaying(false);
            } else {
                m += 0.5;
                setMonths(m);
            }
        }, 100);
    };

    return (
        <div className="flex min-h-screen bg-black text-white">
            <Sidebar />

            <main className="flex-1 relative flex flex-col md:flex-row h-screen overflow-hidden">
                {/* 3D Viewport - Takes up full space on mobile, or left side on desktop */}
                <div className="flex-1 relative h-[60vh] md:h-full bg-gradient-to-b from-gray-900 via-black to-green-900/10">
                    <BodyProjector currentWeight={currentWeight} goalWeight={goalWeight} months={months} />

                    {/* Time Travel Slider Control */}
                    <div className="absolute bottom-10 left-10 right-10 z-20">
                        <div className="bg-black/60 backdrop-blur-lg border border-gray-700 p-6 rounded-2xl shadow-2xl">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={togglePlay}
                                        className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center hover:bg-green-400 transition-colors shadow-lg shadow-green-900/50"
                                    >
                                        <Play className={`w-5 h-5 ml-1 ${isPlaying ? 'animate-pulse' : ''}`} fill="currentColor" />
                                    </button>
                                    <div>
                                        <h3 className="font-bold text-white">Time Travel</h3>
                                        <p className="text-xs text-gray-400">Project your future self</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-2xl font-bold text-green-400">Month {Math.floor(months)}</p>
                                    <p className="text-xs text-gray-500">{(months * 4).toFixed(0)} weeks later</p>
                                </div>
                            </div>

                            <input
                                type="range"
                                min="0"
                                max="12"
                                step="0.1"
                                value={months}
                                onChange={(e) => setMonths(parseFloat(e.target.value))}
                                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-green-500 hover:accent-green-400"
                            />
                            <div className="flex justify-between mt-2 text-xs text-gray-500 font-mono">
                                <span>TODAY</span>
                                <span>6 MONTHS</span>
                                <span>GOAL (1 YEAR)</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stats / Info Panel */}
                <div className="w-full md:w-96 bg-gray-900/80 border-l border-gray-800 p-8 flex flex-col backdrop-blur-md">
                    <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                        <TrendingDown className="text-green-400" />
                        Body Insights
                    </h2>

                    <div className="space-y-6">
                        <div className="p-4 bg-gray-800/50 rounded-xl border border-gray-700">
                            <h4 className="text-sm text-gray-400 mb-1">Starting Weight</h4>
                            <p className="text-2xl font-bold">{currentWeight} kg</p>
                        </div>

                        <div className="p-4 bg-gray-800/50 rounded-xl border border-gray-700">
                            <h4 className="text-sm text-gray-400 mb-1">Target Weight</h4>
                            <p className="text-2xl font-bold">{goalWeight} kg</p>
                        </div>

                        {/* Health Predictions based on slide */}
                        <div>
                            <h4 className="text-sm font-bold text-gray-400 mb-3 uppercase tracking-wider">Predicted Benefits</h4>
                            <motion.div className="space-y-3">
                                <BenefitCard
                                    active={months > 1}
                                    title="Improved Energy"
                                    description="Stabilized blood sugar levels lead to consistent energy."
                                />
                                <BenefitCard
                                    active={months > 3}
                                    title="Better Sleep"
                                    description="Reduction in weight improves sleep quality significantly."
                                />
                                <BenefitCard
                                    active={months > 6}
                                    title="Heart Health"
                                    description="Lower cholesterol and reduced strain on the heart."
                                />
                                <BenefitCard
                                    active={months > 10}
                                    title="Mobility"
                                    description="Reduced joint impact improves overall movement."
                                />
                            </motion.div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

function BenefitCard({ active, title, description }: { active: boolean, title: string, description: string }) {
    return (
        <motion.div
            animate={{ opacity: active ? 1 : 0.3, scale: active ? 1 : 0.98 }}
            className={`p-4 rounded-xl border transition-all ${active ? 'bg-green-900/20 border-green-500/30' : 'bg-gray-800/20 border-gray-800'}`}
        >
            <div className="flex items-center gap-2 mb-1">
                {active ? <CheckIcon /> : <div className="w-4 h-4 rounded-full border border-gray-600" />}
                <h5 className={`font-bold ${active ? 'text-green-400' : 'text-gray-500'}`}>{title}</h5>
            </div>
            <p className="text-xs text-gray-400 leading-relaxed">{description}</p>
        </motion.div>
    );
}

function CheckIcon() {
    return (
        <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
        </div>
    );
}

