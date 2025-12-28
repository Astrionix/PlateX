
'use client';

import { useState } from 'react';
import { ShoppingCart, Check, Loader2, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
    items: string[];
    onComplete?: () => void;
}

export default function SmartCheckout({ items, onComplete }: Props) {
    const [status, setStatus] = useState<'idle' | 'bundling' | 'ready'>('idle');

    const handleCheckout = () => {
        setStatus('bundling');
        setTimeout(() => {
            setStatus('ready');
        }, 2500);
    };

    return (
        <div className="w-full">
            <AnimatePresence mode='wait'>
                {status === 'idle' && (
                    <motion.button
                        exit={{ opacity: 0, y: 10 }}
                        onClick={handleCheckout}
                        className="w-full py-4 bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl font-bold text-white shadow-lg hover:shadow-green-900/40 hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
                    >
                        <ShoppingCart size={20} />
                        Checkout with Instacart
                    </motion.button>
                )}

                {status === 'bundling' && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="w-full py-4 bg-gray-800 rounded-xl border border-gray-700 flex flex-col items-center justify-center text-center"
                    >
                        <Loader2 className="animate-spin text-green-500 mb-2" size={24} />
                        <p className="text-sm font-bold text-white">Bundling {items.length} items...</p>
                        <p className="text-xs text-gray-500">Finding best prices</p>
                    </motion.div>
                )}

                {status === 'ready' && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="w-full bg-white rounded-xl overflow-hidden shadow-2xl"
                    >
                        <div className="bg-green-600 p-4 flex items-center justify-center">
                            <Check className="text-white w-8 h-8 rounded-full border-2 border-white p-1" />
                        </div>
                        <div className="p-6 text-center">
                            <h3 className="text-gray-900 font-bold text-lg mb-1">Cart Ready!</h3>
                            <p className="text-gray-500 text-sm mb-4">Your order has been prepared on Instacart.</p>

                            <a
                                href="#"
                                onClick={(e) => { e.preventDefault(); if (onComplete) onComplete(); }}
                                className="block w-full py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition-colors"
                            >
                                Complete Purchase ($84.50)
                            </a>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
