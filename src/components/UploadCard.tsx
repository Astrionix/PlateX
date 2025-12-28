'use client';

import { useState, useEffect } from 'react';
import { Upload, Loader2, Sparkles } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';
import { GET_API_URL } from '@/lib/api-config';
import { Haptics, ImpactStyle } from '@capacitor/haptics';

interface UploadCardProps {
    onResult: (data: any) => void;
}

export default function UploadCard({ onResult }: UploadCardProps) {
    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [dragActive, setDragActive] = useState(false);

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
            Haptics.impact({ style: ImpactStyle.Light });
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
            Haptics.impact({ style: ImpactStyle.Light });
        }
    };

    // Paste handler
    useEffect(() => {
        const handlePaste = (e: ClipboardEvent) => {
            if (e.clipboardData?.files) {
                const pastedFile = e.clipboardData.files[0];
                if (pastedFile && pastedFile.type.startsWith('image/')) {
                    setFile(pastedFile);
                    Haptics.impact({ style: ImpactStyle.Light });
                }
            }
        };

        window.addEventListener('paste', handlePaste);
        return () => window.removeEventListener('paste', handlePaste);
    }, []);

    const submit = async () => {
        if (!file) return;
        Haptics.impact({ style: ImpactStyle.Heavy });
        setLoading(true);
        try {
            const fd = new FormData();
            fd.append('image', file);
            const res = await fetch(GET_API_URL('/api/analyze'), { method: 'POST', body: fd });
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
        <div className="w-full max-w-lg mx-auto">
            <div className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-xl border border-gray-700/50 rounded-3xl p-8 shadow-2xl">
                {/* Header */}
                <div className="text-center mb-6">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-green-500 to-blue-600 mb-4 shadow-lg shadow-green-900/30">
                        <Sparkles className="w-8 h-8 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-white">Analyze Your Meal</h2>
                    <p className="text-gray-400 text-sm mt-1">Upload a photo to get instant nutrition insights</p>
                </div>

                {/* Image Upload Area */}
                <div
                    className={`relative border-2 border-dashed rounded-2xl p-8 transition-all duration-300 flex flex-col items-center justify-center cursor-pointer mb-6 group
                        ${dragActive ? 'border-green-400 bg-green-400/10 scale-[1.02]' : 'border-gray-600 hover:border-gray-500 bg-gray-800/30'}
                        ${file ? 'border-green-500/50 bg-green-500/5' : ''}
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
                            <div className="relative">
                                <img
                                    src={URL.createObjectURL(file)}
                                    alt="Preview"
                                    className="w-40 h-40 object-cover rounded-xl mb-3 mx-auto shadow-xl ring-2 ring-green-500/30"
                                />
                                <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                                    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                            </div>
                            <p className="text-green-400 font-medium text-sm">Ready to analyze</p>
                            <p className="text-gray-500 text-xs mt-1 truncate max-w-[200px]">{file.name}</p>
                        </div>
                    ) : (
                        <div className="text-center">
                            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gray-700/50 flex items-center justify-center group-hover:bg-gray-700 transition-colors">
                                <Upload className="w-8 h-8 text-gray-400 group-hover:text-gray-300 transition-colors" />
                            </div>
                            <p className="font-medium text-white mb-1">Drop your food photo here</p>
                            <p className="text-sm text-gray-500">or click to browse</p>
                            <div className="flex items-center justify-center gap-2 mt-4">
                                <span className="px-2 py-1 rounded bg-gray-700/50 text-gray-400 text-xs">JPG</span>
                                <span className="px-2 py-1 rounded bg-gray-700/50 text-gray-400 text-xs">PNG</span>
                                <span className="px-2 py-1 rounded bg-gray-700/50 text-gray-400 text-xs">WEBP</span>
                            </div>
                        </div>
                    )}
                </div>

                {/* Analyze Button */}
                <button
                    onClick={submit}
                    disabled={!file || loading}
                    className={`w-full py-4 rounded-xl font-bold text-lg transition-all transform active:scale-[0.98] flex items-center justify-center gap-2
                        ${!file || loading
                            ? 'bg-gray-700/50 text-gray-500 cursor-not-allowed'
                            : 'bg-gradient-to-r from-green-500 to-blue-600 text-white hover:shadow-xl hover:shadow-green-500/20 hover:from-green-400 hover:to-blue-500'
                        }
                    `}
                >
                    {loading ? (
                        <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            Analyzing...
                        </>
                    ) : (
                        <>
                            <Sparkles className="w-5 h-5" />
                            Analyze with AI
                        </>
                    )}
                </button>

                {/* Tip */}
                <p className="text-center text-gray-500 text-xs mt-4">
                    💡 Tip: You can also paste an image from clipboard
                </p>
            </div>
        </div>
    );
}
