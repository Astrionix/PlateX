
'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, X, Command, Activity, Zap } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { GET_API_URL } from '@/lib/api-config';

export default function VoiceCommandCenter() {
    const [isActive, setIsActive] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [processing, setProcessing] = useState(false);
    const [response, setResponse] = useState('');
    const router = useRouter();

    // Speech Recognition Refs
    const recognitionRef = useRef<any>(null);
    const silenceTimerRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        // Initialize Speech Recognition
        if (typeof window !== 'undefined') {
            const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
            if (SpeechRecognition) {
                const recognition = new SpeechRecognition();
                recognition.continuous = false;
                recognition.interimResults = true;
                recognition.lang = 'en-US';

                recognition.onstart = () => {
                    setIsListening(true);
                };

                recognition.onresult = (event: any) => {
                    const current = event.resultIndex;
                    const transcriptText = event.results[current][0].transcript;
                    setTranscript(transcriptText);

                    // Debounce finalization
                    if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
                    silenceTimerRef.current = setTimeout(() => {
                        recognition.stop();
                    }, 1500); // 1.5 seconds silence to trigger stop
                };

                recognition.onend = () => {
                    setIsListening(false);
                    if (transcript) {
                        handleCommand(transcript);
                    }
                };

                recognitionRef.current = recognition;
            }
        }
    }, [transcript]); // Re-bind if needed, actually efficient to just mount once.

    const startListening = () => {
        setTranscript('');
        setResponse('');
        if (recognitionRef.current) {
            try {
                recognitionRef.current.start();
            } catch (e) {
                // Already started
            }
        }
    };

    const stopListening = () => {
        if (recognitionRef.current) {
            recognitionRef.current.stop();
        }
    };

    const handleCommand = async (text: string) => {
        setProcessing(true);

        try {
            const res = await fetch(GET_API_URL('/api/voice-command'), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ transcript: text }),
            });

            const data = await res.json();

            // Speak response
            if (data.speech_response) {
                speak(data.speech_response);
                setResponse(data.speech_response);
            }

            // Execute Action
            switch (data.action) {
                case 'NAVIGATE':
                    if (data.payload?.destination) {
                        router.push(data.payload.destination);
                        setIsActive(false); // Close after nav
                    }
                    break;
                case 'LOG_FOOD':
                    // TODO: Store in context or navigate to log page with pre-filled data
                    // For now, redirect to dashboard
                    router.push('/');
                    break;
                case 'START_WORKFLOW':
                    if (data.payload?.workflow === 'chef_mode') {
                        // We will implement this route soon
                        router.push('/meal-prep');
                    }
                    break;
                default:
                    break;
            }

        } catch (err) {
            console.error(err);
            setResponse("System failure.");
            speak("System failure.");
        } finally {
            setProcessing(false);
        }
    };

    const speak = (text: string) => {
        const utterance = new SpeechSynthesisUtterance(text);
        // Try to find a good voice
        const voices = window.speechSynthesis.getVoices();
        const preferredVoice = voices.find(v => v.name.includes("Google US English") || v.name.includes("Samantha"));
        if (preferredVoice) utterance.voice = preferredVoice;
        utterance.rate = 1.0;
        utterance.pitch = 1.0;
        window.speechSynthesis.speak(utterance);
    };

    return (
        <>
            {/* Trigger Button */}
            <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                    setIsActive(true);
                    setTimeout(startListening, 500); // Auto start
                }}
                className="fixed bottom-6 left-6 w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg shadow-purple-900/30 hover:shadow-xl hover:shadow-purple-900/40 z-50 overflow-hidden"
            >
                <div className="absolute inset-0 bg-white/20 animate-pulse-slow"></div>
                <Mic className="w-6 h-6 text-white relative z-10" />
            </motion.button>

            {/* Full Screen Overlay */}
            <AnimatePresence>
                {isActive && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100] flex flex-col items-center justify-center"
                    >
                        {/* Close Button */}
                        <button
                            onClick={() => {
                                setIsActive(false);
                                stopListening();
                            }}
                            className="absolute top-8 right-8 text-white/50 hover:text-white"
                        >
                            <X className="w-8 h-8" />
                        </button>

                        {/* The Orb */}
                        <div className="relative">
                            {/* Core */}
                            <motion.div
                                animate={{
                                    scale: isListening ? [1, 1.2, 1] : 1,
                                    boxShadow: isListening
                                        ? "0 0 50px 10px rgba(139, 92, 246, 0.5)"
                                        : "0 0 20px 5px rgba(139, 92, 246, 0.3)"
                                }}
                                transition={{ repeat: Infinity, duration: 2 }}
                                className="w-48 h-48 rounded-full bg-gradient-to-br from-indigo-600 to-purple-700 flex items-center justify-center relative z-10 border-4 border-indigo-400/30"
                            >
                                {processing ? (
                                    <Activity className="w-16 h-16 text-white animate-spin" />
                                ) : (
                                    <Mic className={`w-16 h-16 text-white ${isListening ? 'animate-pulse' : ''}`} />
                                )}
                            </motion.div>

                            {/* Orbital Rings */}
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ repeat: Infinity, duration: 10, ease: "linear" }}
                                className="absolute inset-[-20px] rounded-full border border-indigo-500/30 border-t-white/80"
                            />
                            <motion.div
                                animate={{ rotate: -360 }}
                                transition={{ repeat: Infinity, duration: 15, ease: "linear" }}
                                className="absolute inset-[-40px] rounded-full border border-purple-500/20 border-b-white/50"
                            />
                        </div>

                        {/* Status Text */}
                        <div className="mt-12 text-center max-w-lg px-4">
                            <AnimatePresence mode='wait'>
                                {response ? (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="bg-white/10 p-6 rounded-2xl border border-white/10"
                                    >
                                        <div className="flex items-center gap-2 mb-2 text-indigo-300">
                                            <Zap className="w-4 h-4" />
                                            <span className="text-sm font-bold uppercase tracking-wider">System Response</span>
                                        </div>
                                        <p className="text-xl text-white font-light leading-relaxed">
                                            "{response}"
                                        </p>
                                    </motion.div>
                                ) : (
                                    <motion.h2
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="text-3xl font-light text-white"
                                    >
                                        {isListening ? "Listening..." : processing ? "Processing..." : "Tap to Speak"}
                                    </motion.h2>
                                )}
                            </AnimatePresence>

                            {transcript && !response && (
                                <motion.p
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="mt-4 text-indigo-300 text-lg font-mono"
                                >
                                    &gt; {transcript}_
                                </motion.p>
                            )}
                        </div>

                        {/* Quick Actions */}
                        {!isListening && !processing && (
                            <div className="mt-12 flex gap-4">
                                <button
                                    onClick={startListening}
                                    className="px-6 py-3 bg-white/10 hover:bg-white/20 rounded-full text-white font-medium transition-colors border border-white/10 flex items-center gap-2"
                                >
                                    <Mic className="w-4 h-4" /> Try Again
                                </button>
                                {/* <button className="px-6 py-3 bg-white/10 hover:bg-white/20 rounded-full text-white font-medium transition-colors border border-white/10">
                        Keyboard Input
                    </button> */}
                            </div>
                        )}

                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
