'use client';

import { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import { Crown, Check, Sparkles, Zap, Shield, Download, MessageCircle, Calendar } from 'lucide-react';
import { useAuth } from '@/components/AuthProvider';

export default function PremiumPage() {
    const { user } = useAuth();
    const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'yearly'>('yearly');

    const plans = {
        monthly: { price: 9.99, period: '/month', savings: '' },
        yearly: { price: 79.99, period: '/year', savings: 'Save 33%' },
    };

    const features = [
        { icon: Sparkles, title: 'Unlimited AI Analysis', desc: 'Analyze unlimited meals with AI' },
        { icon: Zap, title: 'Advanced Analytics', desc: 'Detailed insights & trends' },
        { icon: Calendar, title: 'Weekly Meal Plans', desc: 'AI-generated 7-day meal plans' },
        { icon: MessageCircle, title: 'Priority AI Chat', desc: 'Faster responses, more context' },
        { icon: Download, title: 'Export Reports', desc: 'PDF & CSV nutrition reports' },
        { icon: Shield, title: 'Ad-Free Experience', desc: 'No ads, just nutrition' },
    ];

    return (
        <div className="flex min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white">
            <Sidebar />

            <main className="flex-1 flex flex-col p-4 md:p-8 overflow-y-auto h-screen">
                <div className="w-full max-w-4xl mx-auto pt-8">
                    {/* Header */}
                    <div className="text-center mb-12">
                        <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-yellow-500 to-amber-600 mb-6 shadow-lg shadow-yellow-900/30">
                            <Crown className="w-10 h-10 text-white" />
                        </div>
                        <h1 className="text-4xl font-bold mb-4">
                            Upgrade to <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-amber-500">Premium</span>
                        </h1>
                        <p className="text-gray-400 text-lg max-w-md mx-auto">
                            Unlock the full power of PlateX and transform your nutrition journey
                        </p>
                    </div>

                    {/* Plan Toggle */}
                    <div className="flex justify-center mb-8">
                        <div className="flex bg-gray-800/50 rounded-xl p-1">
                            <button
                                onClick={() => setSelectedPlan('monthly')}
                                className={`px-6 py-2 rounded-lg font-medium transition-all ${selectedPlan === 'monthly'
                                        ? 'bg-white text-black'
                                        : 'text-gray-400 hover:text-white'
                                    }`}
                            >
                                Monthly
                            </button>
                            <button
                                onClick={() => setSelectedPlan('yearly')}
                                className={`px-6 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${selectedPlan === 'yearly'
                                        ? 'bg-gradient-to-r from-yellow-500 to-amber-500 text-black'
                                        : 'text-gray-400 hover:text-white'
                                    }`}
                            >
                                Yearly
                                {selectedPlan !== 'yearly' && (
                                    <span className="text-xs bg-green-500 text-white px-2 py-0.5 rounded-full">Save 33%</span>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Pricing Card */}
                    <div className="max-w-md mx-auto mb-12">
                        <div className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 border border-yellow-500/30 rounded-3xl p-8 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/10 rounded-full blur-3xl" />

                            <div className="text-center relative z-10">
                                <p className="text-yellow-400 font-medium mb-2">PlateX Premium</p>
                                <div className="flex items-baseline justify-center gap-1 mb-4">
                                    <span className="text-5xl font-bold text-white">${plans[selectedPlan].price}</span>
                                    <span className="text-gray-400">{plans[selectedPlan].period}</span>
                                </div>
                                {selectedPlan === 'yearly' && (
                                    <p className="text-green-400 text-sm mb-6">That's just $6.67/month!</p>
                                )}

                                <button className="w-full py-4 rounded-xl font-bold text-lg bg-gradient-to-r from-yellow-500 to-amber-500 text-black hover:from-yellow-400 hover:to-amber-400 transition-all shadow-lg shadow-yellow-900/30">
                                    Start Free Trial
                                </button>
                                <p className="text-gray-500 text-xs mt-3">7-day free trial • Cancel anytime</p>
                            </div>
                        </div>
                    </div>

                    {/* Features Grid */}
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
                        {features.map((feature, idx) => {
                            const Icon = feature.icon;
                            return (
                                <div key={idx} className="bg-gray-800/40 border border-gray-700/50 rounded-xl p-5 hover:border-yellow-500/30 transition-all">
                                    <div className="flex items-start gap-4">
                                        <div className="w-10 h-10 rounded-lg bg-yellow-500/20 flex items-center justify-center">
                                            <Icon className="w-5 h-5 text-yellow-400" />
                                        </div>
                                        <div>
                                            <h3 className="font-medium text-white mb-1">{feature.title}</h3>
                                            <p className="text-gray-500 text-sm">{feature.desc}</p>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Comparison Table */}
                    <div className="bg-gray-800/40 border border-gray-700/50 rounded-2xl overflow-hidden mb-8">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-gray-700/50">
                                    <th className="text-left p-4 text-gray-400 font-medium">Feature</th>
                                    <th className="text-center p-4 text-gray-400 font-medium">Free</th>
                                    <th className="text-center p-4 text-yellow-400 font-medium">Premium</th>
                                </tr>
                            </thead>
                            <tbody>
                                {[
                                    ['Daily AI Analyses', '3/day', 'Unlimited'],
                                    ['Meal History', '7 days', 'Forever'],
                                    ['AI Chat Assistant', 'Basic', 'Advanced'],
                                    ['Analytics', 'Basic', 'Advanced'],
                                    ['Export Reports', '❌', '✅'],
                                    ['Priority Support', '❌', '✅'],
                                ].map(([feature, free, premium], idx) => (
                                    <tr key={idx} className="border-b border-gray-700/30">
                                        <td className="p-4 text-white">{feature}</td>
                                        <td className="p-4 text-center text-gray-500">{free}</td>
                                        <td className="p-4 text-center text-white font-medium">{premium}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
        </div>
    );
}
