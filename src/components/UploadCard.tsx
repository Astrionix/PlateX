'use client';

import { useState, useEffect } from 'react';
import { Upload, Loader2, Mic, MicOff, Barcode } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';
import dynamic from 'next/dynamic';

const BarcodeScanner = dynamic(() => import('./BarcodeScanner'), { ssr: false });

interface UploadCardProps {
    onResult: (data: any) => void;
}

export default function UploadCard({ onResult }: UploadCardProps) {
    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [dragActive, setDragActive] = useState(false);

    // Voice State
    const [isListening, setIsListening] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [voiceLoading, setVoiceLoading] = useState(false);
    const [showScanner, setShowScanner] = useState(false);

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        } else if (e.type === 'dragleave') {
            setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            setFile(e.dataTransfer.files[0]);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    // Paste handler
    useEffect(() => {
        const handlePaste = (e: ClipboardEvent) => {
            if (e.clipboardData?.files) {
                const pastedFile = e.clipboardData.files[0];
                if (pastedFile && pastedFile.type.startsWith('image/')) {
                    setFile(pastedFile);
                }
            }
        };

        window.addEventListener('paste', handlePaste);
        return () => window.removeEventListener('paste', handlePaste);
    }, []);

    const toggleListening = () => {
        if (isListening) {
            // Stop logic is automatic in simple implementation or handle manually if needed
            setIsListening(false);
            return;
        }

        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        if (!SpeechRecognition) {
            alert("Your browser doesn't support voice recognition. Try Chrome.");
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';

        recognition.onstart = () => setIsListening(true);
        recognition.onend = () => setIsListening(false);

        recognition.onresult = (event: any) => {
            const text = event.results[0][0].transcript;
            setTranscript(text);
        };

        recognition.start();
    };

    const submitVoice = async () => {
        if (!transcript.trim()) return;
        setVoiceLoading(true);
        try {
            const res = await fetch('/api/log-voice', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text: transcript })
            });

            if (!res.ok) throw new Error('Failed');

            const data = await res.json();

            // Save to DB (Log Text requires slightly different saving or reusing same table)
            // Ideally we insert into food_logs here too so it persists
            const { data: { user } } = await supabase.auth.getUser();
            if (user && data) {
                await supabase.from('food_logs').insert({
                    user_id: user.id,
                    image_url: null, // No image
                    health_score: data.health_score,
                    glycemic_load: data.glycemic_load,
                    total_calories: data.total_calories,
                    total_protein: data.total_protein,
                    total_carbs: data.total_carbs,
                    total_fat: data.total_fat,
                    warnings: data.warnings,
                    ingredients: data.ingredients?.map((i: string) => ({ name: i, calories: 0, protein: 0, carbs: 0, fat: 0 })), // Simplified
                    food_name: data.food_name || transcript
                });
            }

            onResult(data);
        } catch (err) {
            console.error(err);
            alert("Failed to analyze voice.");
        } finally {
            setVoiceLoading(false);
        }
    };

    const submit = async () => {
        if (!file) return;
        setLoading(true);
        try {
            const fd = new FormData();
            fd.append('image', file);
            const res = await fetch('/api/analyze', { method: 'POST', body: fd });
            if (!res.ok) {
                const errData = await res.json().catch(() => ({}));
                console.error('Server Error Details:', errData);
                throw new Error(errData.details || errData.error || 'Analysis failed');
            }
            const data = await res.json();
            onResult(data);
        } catch (error) {
            console.error('Submission error:', error);
            alert('Error analyzing image. Check console for details.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full max-w-md mx-auto bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 shadow-xl animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-2xl font-bold text-white mb-4 text-center">Scan Your Meal</h2>

            {/* Switcher Tabs could go here, but let's just stack them for now */}

            {/* Image Upload Area */}
            <div
                className={`relative border-2 border-dashed rounded-xl p-8 transition-all duration-300 flex flex-col items-center justify-center cursor-pointer mb-6
          ${dragActive ? 'border-blue-400 bg-blue-400/10' : 'border-gray-500 hover:border-gray-400 bg-gray-800/50'}
          ${file ? 'border-green-500/50' : ''}
        `}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
            >
                <input
                    type="file"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    accept="image/*"
                    onChange={handleChange}
                />

                {file ? (
                    <div className="text-center">
                        <img
                            src={URL.createObjectURL(file)}
                            alt="Preview"
                            className="w-32 h-32 object-cover rounded-lg mb-2 mx-auto shadow-lg"
                        />
                        <p className="text-green-400 font-medium truncate max-w-[200px]">{file.name}</p>
                    </div>
                ) : (
                    <div className="text-center text-gray-400">
                        <Upload className="w-12 h-12 mx-auto mb-3 text-gray-500" />
                        <p className="font-medium">Drag & drop or click to upload</p>
                        <p className="text-sm text-gray-500 mt-1">Supports JPG, PNG</p>
                    </div>
                )}
            </div>

            {/* Actions for Image */}
            <button
                onClick={submit}
                disabled={!file || loading}
                className={`w-full py-3 rounded-xl font-bold text-lg transition-all transform active:scale-95 mb-6
          ${!file || loading
                        ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                        : 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:shadow-lg hover:shadow-blue-500/30'}
        `}
            >
                {loading ? (
                    <span className="flex items-center justify-center gap-2">
                        <Loader2 className="w-5 h-5 animate-spin" /> Analyzing...
                    </span>
                ) : (
                    'Analyze Image'
                )}
            </button>

            {/* Separator */}
            <div className="relative flex py-2 items-center mb-6">
                <div className="flex-grow border-t border-gray-600"></div>
                <span className="flex-shrink-0 mx-4 text-gray-500 text-sm">Or use other tools</span>
                <div className="flex-grow border-t border-gray-600"></div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
                <button
                    onClick={() => setShowScanner(true)}
                    className="flex items-center justify-center gap-2 bg-gray-800 hover:bg-gray-700 text-white p-3 rounded-xl border border-gray-700 transition-colors"
                >
                    <Barcode className="text-blue-400" /> Scan Barcode
                </button>
                <button
                    onClick={() => {
                        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
                        if (!SpeechRecognition) return alert("Browser not supported");
                        if (isListening) setIsListening(false);
                        else toggleListening();
                    }}
                    className={`flex items-center justify-center gap-2 text-white p-3 rounded-xl border border-gray-700 transition-colors ${isListening ? 'bg-red-500/20 border-red-500 animate-pulse' : 'bg-gray-800 hover:bg-gray-700'}`}
                >
                    {isListening ? <MicOff className="text-red-400" /> : <Mic className="text-purple-400" />} {isListening ? 'Stop' : 'Voice Log'}
                </button>
            </div>

            {/* Voice Input Text Area (Conditional) */}
            {(isListening || transcript) && (
                <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700 mb-4 animate-in fade-in zoom-in duration-300">
                    <div className="flex gap-3">
                        <textarea
                            value={transcript}
                            onChange={(e) => setTranscript(e.target.value)}
                            placeholder="Describe your meal..."
                            className="w-full bg-transparent border-none outline-none text-white placeholder:text-gray-600 resize-none h-20"
                        />
                    </div>
                    <div className="flex justify-end mt-2">
                        <button
                            onClick={submitVoice}
                            disabled={!transcript || voiceLoading}
                            className="text-xs bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-lg text-white disabled:opacity-50 font-bold"
                        >
                            {voiceLoading ? <Loader2 size={16} className="animate-spin" /> : 'Log This'}
                        </button>
                    </div>
                </div>
            )}

            {showScanner && (
                <BarcodeScanner
                    onResult={(res) => {
                        onResult(res);
                        setShowScanner(false);
                    }}
                    onClose={() => setShowScanner(false)}
                />
            )}


        </div>
    );
}
