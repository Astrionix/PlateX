
'use client';

import { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import { Trophy, Users, Swords, Crown, Medal, Flame, TrendingUp, UserPlus, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function SocialPage() {
    const [activeTab, setActiveTab] = useState<'leaderboard' | 'duels' | 'feed'>('leaderboard');

    // Mock Data
    const leaderboard = [
        { id: 1, name: "Shubhra Hebbar", score: 2450, rank: 1, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix", trend: "+12%" },
        { id: 2, name: "Sarah Connor", score: 2100, rank: 2, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah", trend: "+5%" },
        { id: 3, name: "John Wick", score: 1950, rank: 3, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=John", trend: "+8%" },
        { id: 4, name: "Tony Stark", score: 1800, rank: 4, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Tony", trend: "-2%" },
        { id: 5, name: "Bruce Wayne", score: 1750, rank: 5, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Bruce", trend: "+1%" },
    ];

    const duels = [
        { id: 1, opponent: "Sarah Connor", type: "Hydration Hero", status: "Winning", timeLeft: "4h 20m", myScore: 8, oppScore: 6 },
        { id: 2, opponent: "Tony Stark", type: "Protein Power", status: "Losing", timeLeft: "1d 12h", myScore: 120, oppScore: 150 },
    ];

    return (
        <div className="flex min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white">
            <Sidebar />

            <main className="flex-1 p-4 md:p-8 overflow-y-auto h-screen">
                <div className="max-w-5xl mx-auto pt-8">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h2 className="text-3xl font-bold text-white mb-2">Social Hub</h2>
                            <p className="text-gray-400">Compete with friends and track your community ranking.</p>
                        </div>
                        <button className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-xl flex items-center gap-2 transition-all">
                            <UserPlus size={18} />
                            Invite Friends
                        </button>
                    </div>

                    {/* Navigation Tabs */}
                    <div className="flex bg-gray-800/50 p-1 rounded-xl mb-8 w-fit">
                        {[
                            { id: 'leaderboard', icon: Trophy, label: 'Leaderboard' },
                            { id: 'duels', icon: Swords, label: 'Active Duels' },
                            { id: 'feed', icon: Users, label: 'Community Feed' },
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as any)}
                                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${activeTab === tab.id
                                        ? 'bg-gray-700 text-white shadow-lg'
                                        : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                                    }`}
                            >
                                <tab.icon size={18} />
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    {/* Content Area */}
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        {activeTab === 'leaderboard' && (
                            <div className="space-y-4">
                                {/* Top 3 Podium (Visual Only - simplified vertical list for now, maybe 3D later) */}
                                <div className="grid md:grid-cols-3 gap-6 mb-8">
                                    {leaderboard.slice(0, 3).map((user) => (
                                        <div key={user.id} className={`relative p-6 rounded-2xl border ${user.rank === 1 ? 'bg-yellow-500/10 border-yellow-500/50' :
                                                user.rank === 2 ? 'bg-gray-400/10 border-gray-400/50' :
                                                    'bg-orange-700/10 border-orange-700/50'
                                            } flex flex-col items-center text-center`}>
                                            <div className="absolute -top-4">
                                                {user.rank === 1 && <Crown className="w-8 h-8 text-yellow-500 animate-bounce" />}
                                                {user.rank === 2 && <Medal className="w-8 h-8 text-gray-400" />}
                                                {user.rank === 3 && <Medal className="w-8 h-8 text-orange-700" />}
                                            </div>
                                            <img src={user.avatar} className="w-20 h-20 rounded-full border-4 border-white/10 mb-3" alt={user.name} />
                                            <h3 className="font-bold text-lg">{user.name}</h3>
                                            <p className="text-2xl font-bold my-1">{user.score} pts</p>
                                            <div className="flex items-center gap-1 text-green-400 text-sm">
                                                <TrendingUp size={14} />
                                                {user.trend}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* List for the rest */}
                                <div className="bg-gray-800/30 rounded-2xl p-6 border border-gray-700/50">
                                    <h3 className="text-lg font-bold mb-4">Runner Ups</h3>
                                    {leaderboard.slice(3).map((user) => (
                                        <div key={user.id} className="flex items-center justify-between p-4 hover:bg-gray-700/30 rounded-xl transition-colors">
                                            <div className="flex items-center gap-4">
                                                <span className="w-6 font-bold text-gray-500">#{user.rank}</span>
                                                <img src={user.avatar} className="w-10 h-10 rounded-full" alt={user.name} />
                                                <span className="font-medium">{user.name}</span>
                                            </div>
                                            <div className="flex items-center gap-6">
                                                <span className={`${user.trend.startsWith('+') ? 'text-green-400' : 'text-red-400'} text-sm`}>{user.trend}</span>
                                                <span className="font-bold">{user.score} pts</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {activeTab === 'duels' && (
                            <div className="grid md:grid-cols-2 gap-6">
                                {duels.map((duel) => (
                                    <div key={duel.id} className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-2xl p-6 relative overflow-hidden group hover:border-blue-500/50 transition-all">
                                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                            <Swords className="w-32 h-32" />
                                        </div>

                                        <div className="flex justify-between items-start mb-6">
                                            <div>
                                                <h3 className="text-xl font-bold text-white mb-1">{duel.type} Duel</h3>
                                                <p className="text-sm text-gray-400">vs {duel.opponent}</p>
                                            </div>
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${duel.status === 'Winning' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                                                }`}>
                                                {duel.status}
                                            </span>
                                        </div>

                                        <div className="flex items-center gap-4 mb-6">
                                            <div className="flex-1 bg-gray-800 rounded-full h-4 overflow-hidden">
                                                <div className="bg-blue-500 h-full" style={{ width: `${(duel.myScore / (duel.myScore + duel.oppScore)) * 100}%` }}></div>
                                            </div>
                                            <div className="text-xs font-bold text-gray-500">VS</div>
                                            <div className="flex-1 bg-gray-800 rounded-full h-4 overflow-hidden flex justify-end">
                                                <div className="bg-red-500 h-full" style={{ width: `${(duel.oppScore / (duel.myScore + duel.oppScore)) * 100}%` }}></div>
                                            </div>
                                        </div>

                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-blue-400 font-bold">You: {duel.myScore}</span>
                                            <span className="text-gray-500 flex items-center gap-1"><ClockIcon /> {duel.timeLeft}</span>
                                            <span className="text-red-400 font-bold">Them: {duel.oppScore}</span>
                                        </div>
                                    </div>
                                ))}

                                {/* Start New Duel Card */}
                                <button className="border-2 border-dashed border-gray-700 rounded-2xl p-6 flex flex-col items-center justify-center text-gray-500 hover:border-gray-500 hover:text-gray-300 transition-all min-h-[200px]">
                                    <Swords className="w-12 h-12 mb-4" />
                                    <span className="font-medium">Challenger a specific friend</span>
                                    <span className="text-xs mt-2">Win points & badges</span>
                                </button>
                            </div>
                        )}

                        {activeTab === 'feed' && (
                            <div className="bg-gray-800/30 rounded-2xl border border-gray-700/50 p-6 flex flex-col items-center justify-center text-center py-20">
                                <Users className="w-16 h-16 text-gray-600 mb-4" />
                                <h3 className="text-xl font-bold text-white mb-2">Community Feed is quiet</h3>
                                <p className="text-gray-400 max-w-md">
                                    Invite friends to see their recent healthy meals, streaks, and achievements here!
                                </p>
                            </div>
                        )}
                    </motion.div>
                </div>
            </main>
        </div>
    );
}

function ClockIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
    )
}
