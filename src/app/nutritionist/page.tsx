'use client';

import { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import { Users, Calendar, Video, MessageCircle, Star, Clock, Award, ArrowRight } from 'lucide-react';
import { useAuth } from '@/components/AuthProvider';

interface Nutritionist {
    id: string;
    name: string;
    title: string;
    specialties: string[];
    rating: number;
    reviews: number;
    price: number;
    image: string;
    available: boolean;
}

export default function NutritionistPage() {
    const { user } = useAuth();
    const [selectedType, setSelectedType] = useState<'video' | 'chat'>('video');

    const nutritionists: Nutritionist[] = [
        {
            id: '1',
            name: 'Dr. Sarah Chen',
            title: 'Registered Dietitian',
            specialties: ['Weight Loss', 'Sports Nutrition'],
            rating: 4.9,
            reviews: 128,
            price: 75,
            image: '👩‍⚕️',
            available: true,
        },
        {
            id: '2',
            name: 'Michael Torres',
            title: 'Clinical Nutritionist',
            specialties: ['Diabetes Management', 'Heart Health'],
            rating: 4.8,
            reviews: 96,
            price: 60,
            image: '👨‍⚕️',
            available: true,
        },
        {
            id: '3',
            name: 'Dr. Emily Park',
            title: 'Sports Dietitian',
            specialties: ['Athletic Performance', 'Muscle Gain'],
            rating: 5.0,
            reviews: 74,
            price: 85,
            image: '👩‍⚕️',
            available: false,
        },
        {
            id: '4',
            name: 'James Wilson',
            title: 'Holistic Nutritionist',
            specialties: ['Gut Health', 'Vegan Nutrition'],
            rating: 4.7,
            reviews: 112,
            price: 55,
            image: '👨‍⚕️',
            available: true,
        },
    ];

    return (
        <div className="flex min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white">
            <Sidebar />

            <main className="flex-1 flex flex-col p-4 md:p-8 overflow-y-auto h-screen">
                <div className="w-full max-w-4xl mx-auto pt-8">
                    {/* Header */}
                    <header className="mb-8">
                        <h2 className="text-3xl font-bold text-white mb-2">Connect with a Nutritionist</h2>
                        <p className="text-gray-400">Get personalized advice from certified nutrition experts</p>
                    </header>

                    {/* Consultation Type Toggle */}
                    <div className="flex gap-4 mb-8">
                        <button
                            onClick={() => setSelectedType('video')}
                            className={`flex-1 p-4 rounded-xl border transition-all flex items-center justify-center gap-3 ${selectedType === 'video'
                                    ? 'bg-blue-500/20 border-blue-500 text-white'
                                    : 'bg-gray-800/40 border-gray-700 text-gray-400 hover:border-gray-600'
                                }`}
                        >
                            <Video className={selectedType === 'video' ? 'text-blue-400' : ''} />
                            <div className="text-left">
                                <p className="font-medium">Video Call</p>
                                <p className="text-xs text-gray-500">30-min consultation</p>
                            </div>
                        </button>
                        <button
                            onClick={() => setSelectedType('chat')}
                            className={`flex-1 p-4 rounded-xl border transition-all flex items-center justify-center gap-3 ${selectedType === 'chat'
                                    ? 'bg-green-500/20 border-green-500 text-white'
                                    : 'bg-gray-800/40 border-gray-700 text-gray-400 hover:border-gray-600'
                                }`}
                        >
                            <MessageCircle className={selectedType === 'chat' ? 'text-green-400' : ''} />
                            <div className="text-left">
                                <p className="font-medium">Chat Support</p>
                                <p className="text-xs text-gray-500">Async messaging</p>
                            </div>
                        </button>
                    </div>

                    {/* Nutritionists Grid */}
                    <div className="space-y-4">
                        {nutritionists.map(nutritionist => (
                            <div
                                key={nutritionist.id}
                                className={`bg-gray-800/40 border border-gray-700/50 rounded-2xl p-6 hover:border-gray-600 transition-all ${!nutritionist.available ? 'opacity-60' : ''
                                    }`}
                            >
                                <div className="flex items-start gap-4">
                                    {/* Avatar */}
                                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-3xl">
                                        {nutritionist.image}
                                    </div>

                                    {/* Info */}
                                    <div className="flex-1">
                                        <div className="flex items-start justify-between mb-2">
                                            <div>
                                                <h3 className="font-bold text-white">{nutritionist.name}</h3>
                                                <p className="text-sm text-gray-400">{nutritionist.title}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-2xl font-bold text-white">${nutritionist.price}</p>
                                                <p className="text-xs text-gray-500">per session</p>
                                            </div>
                                        </div>

                                        {/* Specialties */}
                                        <div className="flex flex-wrap gap-2 mb-3">
                                            {nutritionist.specialties.map(spec => (
                                                <span key={spec} className="text-xs bg-gray-700/50 text-gray-300 px-2 py-1 rounded-full">
                                                    {spec}
                                                </span>
                                            ))}
                                        </div>

                                        {/* Rating & Availability */}
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                <div className="flex items-center gap-1">
                                                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                                                    <span className="font-medium text-white">{nutritionist.rating}</span>
                                                    <span className="text-gray-500 text-sm">({nutritionist.reviews})</span>
                                                </div>
                                                {nutritionist.available ? (
                                                    <span className="flex items-center gap-1 text-green-400 text-sm">
                                                        <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                                                        Available
                                                    </span>
                                                ) : (
                                                    <span className="text-gray-500 text-sm">Unavailable</span>
                                                )}
                                            </div>
                                            <button
                                                disabled={!nutritionist.available}
                                                className={`px-4 py-2 rounded-xl font-medium text-sm flex items-center gap-2 transition-all ${nutritionist.available
                                                        ? 'bg-gradient-to-r from-green-500 to-blue-600 text-white hover:from-green-400 hover:to-blue-500'
                                                        : 'bg-gray-700 text-gray-500 cursor-not-allowed'
                                                    }`}
                                            >
                                                Book Now <ArrowRight size={14} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Share Data Banner */}
                    <div className="mt-8 bg-blue-500/10 border border-blue-500/30 rounded-2xl p-6">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
                                <Award className="w-6 h-6 text-blue-400" />
                            </div>
                            <div className="flex-1">
                                <h3 className="font-bold text-white mb-1">Share Your PlateX Data</h3>
                                <p className="text-gray-400 text-sm">
                                    Give your nutritionist access to your food logs and analytics for personalized advice
                                </p>
                            </div>
                            <button className="px-4 py-2 bg-blue-500/20 border border-blue-500/30 rounded-xl text-blue-300 font-medium text-sm hover:bg-blue-500/30 transition-all">
                                Enable Sharing
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
