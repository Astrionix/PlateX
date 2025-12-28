
'use client';

import { useState, useRef, useEffect } from 'react';
import { Camera, Scan, X, ChevronRight, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { GET_API_URL } from '@/lib/api-config';

export default function ARMenuScanner() {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isActive, setIsActive] = useState(false);
    const [scannedText, setScannedText] = useState('');
    const [analysis, setAnalysis] = useState<any>(null);
    const [scanning, setScanning] = useState(false);

    const startCamera = async () => {
        setIsActive(true);
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }
        } catch (err) {
            console.error(err);
        }
    };

    const stopCamera = () => {
        setIsActive(false);
        if (videoRef.current && videoRef.current.srcObject) {
            const stream = videoRef.current.srcObject as MediaStream;
            stream.getTracks().forEach(track => track.stop());
        }
    };

    const captureAndAnalyze = async () => {
        if (!videoRef.current || !canvasRef.current) return;
        setScanning(true);

        // Draw video frame to canvas
        const ctx = canvasRef.current.getContext('2d');
        canvasRef.current.width = videoRef.current.videoWidth;
        canvasRef.current.height = videoRef.current.videoHeight;
        ctx?.drawImage(videoRef.current, 0, 0);

        // Get image data URL (Simulation of OCR since we can't run Tesseract client-side reliably without heavy assets)
        // In a real app, we'd send the image to Gemini Vision directly.
        // For this demo, we'll mock the text based on a "Menu" template.

        // Mock API Call
        try {
            // Simulating text extraction from "photo"
            const mockMenuText = "Grilled Salmon - $18\nCaesar Salad - $12\nDouble Cheeseburger with Fries - $16\nQuinoa Bowl - $14\nFried Chicken - $15\nSteamed Veggies - $8";

            const res = await fetch(GET_API_URL('/api/menu-scanner'), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    menuText: mockMenuText,
                    userGoals: { goal: 'weight_loss', diet: 'high_protein' }
                })
            });
            const data = await res.json();
            setAnalysis(data);
        } catch (e) {
            console.error(e);
        } finally {
            setScanning(false);
        }
    };

    return (
        <>
            <button
                onClick={startCamera}
                className="fixed bottom-24 left-6 w-14 h-14 bg-gray-900 rounded-full flex items-center justify-center border border-gray-700 text-white shadow-lg z-40 hover:scale-105 transition-all"
            >
                <Scan size={24} />
            </button>

            <AnimatePresence>
                {isActive && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] bg-black"
                    >
                        <video
                            ref={videoRef}
                            autoPlay
                            playsInline
                            className="w-full h-full object-cover opacity-50"
                        />
                        <canvas ref={canvasRef} className="hidden" />

                        {/* AR Overlay UI */}
                        <div className="absolute inset-0 flex flex-col items-center justify-between p-8 safe-area-inset">
                            {/* Header */}
                            <div className="w-full flex justify-between items-start">
                                <div>
                                    <h2 className="text-2xl font-bold text-white text-shadow">AR Menu X-Ray</h2>
                                    <p className="text-white/80">Point at any menu to find healthy options.</p>
                                </div>
                                <button onClick={stopCamera} className="p-2 bg-black/50 rounded-full text-white">
                                    <X size={24} />
                                </button>
                            </div>

                            {/* AR Reticle */}
                            {!analysis && (
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 border-2 border-white/50 rounded-xl flex items-center justify-center">
                                    <div className="w-60 h-60 border border-white/30 rounded-lg animate-pulse" />
                                    <div className="absolute top-0 left-0 w-4 h-4 border-t-4 border-l-4 border-green-500 -mt-1 -ml-1" />
                                    <div className="absolute top-0 right-0 w-4 h-4 border-t-4 border-r-4 border-green-500 -mt-1 -mr-1" />
                                    <div className="absolute bottom-0 left-0 w-4 h-4 border-b-4 border-l-4 border-green-500 -mb-1 -ml-1" />
                                    <div className="absolute bottom-0 right-0 w-4 h-4 border-b-4 border-r-4 border-green-500 -mb-1 -mr-1" />
                                </div>
                            )}

                            {/* Analysis Results Overlay */}
                            {analysis && (
                                <div className="absolute inset-x-4 top-24 bottom-32 overflow-y-auto space-y-4 pointer-events-none">
                                    {analysis.recommended_items?.map((item: any, idx: number) => (
                                        <motion.div
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: idx * 0.1 }}
                                            key={idx}
                                            className="bg-green-500/90 backdrop-blur-md p-4 rounded-xl border border-green-400/50 shadow-lg pointer-events-auto"
                                        >
                                            <div className="flex justify-between items-start">
                                                <h3 className="font-bold text-white text-lg">{item.name}</h3>
                                                <span className="bg-white/20 px-2 py-1 rounded text-xs font-bold text-white">{item.match_score}% Match</span>
                                            </div>
                                            <p className="text-white/90 text-sm mt-1">{item.reason}</p>
                                        </motion.div>
                                    ))}
                                </div>
                            )}

                            {/* Controls */}
                            <div className="w-full flex justify-center mb-8">
                                <button
                                    onClick={captureAndAnalyze}
                                    disabled={scanning}
                                    className="w-20 h-20 rounded-full border-4 border-white flex items-center justify-center bg-white/20 backdrop-blur hover:bg-white/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {scanning ? (
                                        <div className="w-full h-full rounded-full border-4 border-green-500 border-t-transparent animate-spin" />
                                    ) : (
                                        <div className="w-16 h-16 bg-white rounded-full" />
                                    )}
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
