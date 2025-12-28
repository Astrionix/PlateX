
'use client';

import Sidebar from '@/components/Sidebar';
import ARMenuScanner from '@/components/ARMenuScanner';
import { Scan, Utensils } from 'lucide-react';

export default function ARMenuPage() {
    return (
        <div className="flex min-h-screen bg-black text-white">
            <Sidebar />

            <main className="flex-1 relative flex flex-col h-screen overflow-hidden">
                {/* Background Video/Image placeholder */}
                <div className="absolute inset-0 bg-cover bg-center opacity-30" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=2000&auto=format&fit=crop)' }}></div>
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/80 to-transparent"></div>

                <div className="relative z-10 flex-1 flex flex-col items-center justify-center p-8 text-center max-w-2xl mx-auto">
                    <div className="w-24 h-24 bg-pink-500/20 rounded-full flex items-center justify-center mb-6 animate-pulse">
                        <Scan className="w-12 h-12 text-pink-500" />
                    </div>

                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">AR Menu X-Ray</h2>
                    <p className="text-xl text-gray-300 mb-12">
                        Point your camera at any restaurant menu to instantly find the healthiest options that match your diet.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full text-left mb-12">
                        <div className="bg-gray-800/50 p-6 rounded-2xl border border-gray-700">
                            <h3 className="font-bold text-white mb-2">1. Point</h3>
                            <p className="text-gray-400 text-sm">Aim your camera at the physical menu.</p>
                        </div>
                        <div className="bg-gray-800/50 p-6 rounded-2xl border border-gray-700">
                            <h3 className="font-bold text-white mb-2">2. Analyze</h3>
                            <p className="text-gray-400 text-sm">AI identifies ingredients and macros instantly.</p>
                        </div>
                        <div className="bg-gray-800/50 p-6 rounded-2xl border border-gray-700">
                            <h3 className="font-bold text-white mb-2">3. Eat</h3>
                            <p className="text-gray-400 text-sm">Get highlighted recommendations on screen.</p>
                        </div>
                    </div>
                </div>

                {/* The Scanner Component is always mounted but activates on click */}
                <ARMenuScanner />
            </main>
        </div>
    );
}
