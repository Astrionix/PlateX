
'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Clock, Check, Mic, Volume2, X, Play, RotateCw } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface Step {
    instruction: string;
    duration?: number; // minutes
}

interface ChefModeProps {
    title: string;
    ingredients: string[];
    steps: Step[];
    onClose: () => void;
}

export default function ChefMode({ title, ingredients, steps, onClose }: ChefModeProps) {
    const [currentStep, setCurrentStep] = useState(0);
    const [timer, setTimer] = useState<number | null>(null);
    const [isTimerRunning, setIsTimerRunning] = useState(false);
    const wakeLockRef = useRef<any>(null);

    // Request Wake Lock
    useEffect(() => {
        const requestWakeLock = async () => {
            if ('wakeLock' in navigator) {
                try {
                    wakeLockRef.current = await (navigator as any).wakeLock.request('screen');
                } catch (err) {
                    console.error(err);
                }
            }
        };
        requestWakeLock();
        return () => {
            if (wakeLockRef.current) wakeLockRef.current.release();
        };
    }, []);

    // Timer Logic
    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isTimerRunning && timer !== null && timer > 0) {
            interval = setInterval(() => {
                setTimer((prev) => (prev && prev > 0 ? prev - 1 : 0));
            }, 1000);
        } else if (timer === 0) {
            setIsTimerRunning(false);
            // Play Alarm Sound
            const audio = new Audio('/sounds/alarm.mp3'); // We assume this exists or fails silently
            audio.play().catch(() => { });
            speak("Timer finished!");
        }
        return () => clearInterval(interval);
    }, [isTimerRunning, timer]);

    const speak = (text: string) => {
        const utterance = new SpeechSynthesisUtterance(text);
        window.speechSynthesis.speak(utterance);
    };

    const nextStep = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(prev => prev + 1);
            speak(steps[currentStep + 1].instruction);
        } else {
            speak("Recipe completed! Bon appétit.");
        }
    };

    const prevStep = () => {
        if (currentStep > 0) {
            setCurrentStep(prev => prev - 1);
            speak(steps[currentStep - 1].instruction);
        }
    };

    const toggleTimer = () => {
        if (timer === null && steps[currentStep].duration) {
            setTimer(steps[currentStep].duration! * 60);
        }
        setIsTimerRunning(!isTimerRunning);
    };

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s < 10 ? '0' : ''}${s}`;
    };

    // Auto-detect timer in step
    useEffect(() => {
        // Reset timer when changing steps
        setTimer(null);
        setIsTimerRunning(false);

        // Check if there is a duration
        if (steps[currentStep].duration) {
            setTimer(steps[currentStep].duration! * 60);
        }
    }, [currentStep, steps]);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black z-[200] flex flex-col items-center justify-between p-6 overflow-hidden"
        >
            {/* Background Gradient */}
            <div className="absolute inset-0 bg-gradient-to-b from-gray-900 to-black z-0" />

            {/* Header */}
            <div className="relative z-10 w-full flex items-center justify-between mb-8">
                <button onClick={onClose} className="p-3 bg-white/10 rounded-full hover:bg-white/20 transition-all">
                    <X className="w-6 h-6 text-white" />
                </button>
                <h2 className="text-xl font-bold text-white/80 uppercase tracking-widest">Chef Mode</h2>
                <div className="w-12" /> {/* Spacer */}
            </div>

            {/* Main Content */}
            <div className="relative z-10 flex-1 w-full max-w-4xl flex flex-col items-center justify-center">
                <AnimatePresence mode='wait'>
                    <motion.div
                        key={currentStep}
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -50 }}
                        transition={{ type: "spring", bounce: 0.2 }}
                        className="text-center"
                    >
                        <h3 className="text-sm font-bold text-green-400 mb-4 uppercase tracking-widest">
                            Step {currentStep + 1} of {steps.length}
                        </h3>
                        <p className="text-3xl md:text-5xl font-medium text-white leading-tight mb-12">
                            {steps[currentStep].instruction}
                        </p>

                        {/* Ingredients check for this step? Omitted for simplicity, showing all at bottom */}
                    </motion.div>
                </AnimatePresence>

                {/* Timer Widget */}
                {(timer !== null || steps[currentStep].duration) && (
                    <div className="mb-12">
                        <button
                            onClick={toggleTimer}
                            className={`flex items-center gap-4 px-8 py-4 rounded-full text-2xl font-mono transition-all ${isTimerRunning
                                    ? 'bg-red-500/20 text-red-400 border border-red-500/50 animate-pulse'
                                    : 'bg-gray-800 text-gray-300 border border-gray-700 hover:border-green-500'
                                }`}
                        >
                            <Clock className="w-8 h-8" />
                            {timer !== null ? formatTime(timer) : `${steps[currentStep].duration} min`}
                            {isTimerRunning ? <span className="text-sm uppercase font-bold ml-2">Running</span> : <Play className="w-6 h-6 ml-2" />}
                        </button>
                    </div>
                )}
            </div>

            {/* Controls */}
            <div className="relative z-10 w-full max-w-2xl grid grid-cols-3 gap-6">
                <button
                    onClick={prevStep}
                    disabled={currentStep === 0}
                    className="flex flex-col items-center gap-2 p-6 rounded-2xl bg-gray-800/50 hover:bg-gray-800 transition-all disabled:opacity-30 disabled:cursor-not-allowed border border-white/5"
                >
                    <ChevronLeft className="w-8 h-8 text-white" />
                    <span className="text-xs font-bold text-gray-400 uppercase">Previous</span>
                </button>

                <div className="flex flex-col items-center justify-center">
                    <button
                        onClick={() => speak(steps[currentStep].instruction)}
                        className="p-6 bg-green-500 rounded-full shadow-lg shadow-green-900/50 hover:scale-105 transition-all mb-2"
                    >
                        <Volume2 className="w-8 h-8 text-white" />
                    </button>
                    <span className="text-xs font-bold text-gray-400 uppercase">Read Step</span>
                </div>

                <button
                    onClick={nextStep}
                    disabled={currentStep === steps.length - 1}
                    className="flex flex-col items-center gap-2 p-6 rounded-2xl bg-gray-800/50 hover:bg-gray-800 transition-all disabled:opacity-30 disabled:cursor-not-allowed border border-white/5"
                >
                    <ChevronRight className="w-8 h-8 text-white" />
                    <span className="text-xs font-bold text-gray-400 uppercase">Next</span>
                </button>
            </div>

            {/* Ingredient Drawer Hint */}
            <div className="relative z-10 mt-6 text-gray-500 text-sm">
                Ingredients: {ingredients.slice(0, 3).join(', ')}...
            </div>
        </motion.div>
    );
}
