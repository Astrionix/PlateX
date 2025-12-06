'use client';

import { useState, useRef, useEffect } from 'react';
import { Html5QrcodeScanner, Html5QrcodeSupportedFormats } from 'html5-qrcode';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from './AuthProvider';
import { Loader2, X, Barcode } from 'lucide-react';

interface BarcodeScannerProps {
    onResult: (data: any) => void;
    onClose: () => void;
}

export default function BarcodeScanner({ onResult, onClose }: BarcodeScannerProps) {
    const { user } = useAuth();
    const [scanResult, setScanResult] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Initialize Scanner
        const formatsToSupport = [
            Html5QrcodeSupportedFormats.UPC_A,
            Html5QrcodeSupportedFormats.UPC_E,
            Html5QrcodeSupportedFormats.UPC_EAN_EXTENSION,
            Html5QrcodeSupportedFormats.EAN_13,
            Html5QrcodeSupportedFormats.EAN_8,
        ];

        const scanner = new Html5QrcodeScanner(
            "reader",
            { fps: 10, qrbox: { width: 250, height: 250 }, formatsToSupport: formatsToSupport },
            /* verbose= */ false
        );

        scanner.render(onScanSuccess, onScanFailure);

        function onScanSuccess(decodedText: string) {
            scanner.clear();
            setScanResult(decodedText);
            fetchProduct(decodedText);
        }

        function onScanFailure(error: any) {
            // handle scan failure, usually better to ignore and keep scanning.
            // console.warn(error);
        }

        return () => {
            // Cleanup handled by scanner.clear() usually, 
            // but if component unmounts we need to be careful. 
            // html5-qrcode is finicky with React strict mode double renders.
            try { scanner.clear().catch(e => console.log('Scanner clearing error', e)); } catch (e) { }
        };
    }, []);

    const fetchProduct = async (code: string) => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch(`/api/barcode?code=${code}`);
            if (!res.ok) throw new Error('Product not found');
            const data = await res.json();

            // Build compatible result object
            const resultData = {
                food_name: data.product_name,
                total_calories: data.calories,
                health_score: data.health_score,
                ingredients: [], // Could parse ingredients_text from OFF if needed
                image_url: data.image_url,
                total_protein: data.protein,
                total_carbs: data.carbs,
                total_fat: data.fat,
                glycemic_load: 'Unknown',
                warnings: [],
                is_barcode: true
            };

            // Auto-log to DB
            if (user) {
                await supabase.from('food_logs').insert({
                    user_id: user.id,
                    ...resultData,
                    ingredients: [], // Empty for barcode items usually
                    image_url: data.image_url
                });
            }

            onResult(resultData);
            onClose();

        } catch (err: any) {
            setError(err.message || "Failed to lookup product");
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md">
            <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6 w-full max-w-md relative">
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white">
                    <X size={24} />
                </button>

                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                    <Barcode className="text-blue-400" /> Scan Barcode
                </h3>

                {loading ? (
                    <div className="h-64 flex flex-col items-center justify-center text-gray-400">
                        <Loader2 className="w-8 h-8 animate-spin mb-2 text-blue-500" />
                        <p>Looking up product details...</p>
                        <p className="text-sm font-mono mt-2 text-gray-500">{scanResult}</p>
                    </div>
                ) : error ? (
                    <div className="h-64 flex flex-col items-center justify-center text-center">
                        <div className="text-red-400 mb-2">⚠️ {error}</div>
                        <p className="text-gray-500 text-sm mb-4">Try scanning again or enter manually.</p>
                        <button onClick={() => window.location.reload()} className="text-blue-400 underline">Reset Scanner</button>
                    </div>
                ) : (
                    <div className="overflow-hidden rounded-xl bg-black">
                        <div id="reader" className="w-full"></div>
                    </div>
                )}

                <p className="text-center text-xs text-gray-500 mt-4">
                    Point camera at a barcode on food packaging.
                </p>
            </div>
        </div>
    );
}
