'use client';

import { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import { Settings as SettingsIcon, Bell, Shield, Trash2, ChevronRight } from 'lucide-react';

export default function Settings() {
    const [settings, setSettings] = useState({
        units: 'metric',
        notifications: true,
        theme: 'dark'
    });

    useEffect(() => {
        const saved = localStorage.getItem('platex_settings');
        if (saved) {
            setSettings(JSON.parse(saved));
        }
    }, []);

    const toggleSetting = (key: string) => {
        setSettings(prev => {
            const newSettings = { ...prev, [key]: !prev[key as keyof typeof prev] };
            localStorage.setItem('platex_settings', JSON.stringify(newSettings));
            return newSettings;
        });
    };

    const changeSetting = (key: string, value: string) => {
        setSettings(prev => {
            const newSettings = { ...prev, [key]: value };
            localStorage.setItem('platex_settings', JSON.stringify(newSettings));
            return newSettings;
        });
    };

    const clearData = () => {
        if (confirm('Are you sure you want to clear all local data? This cannot be undone.')) {
            localStorage.removeItem('platex_profile');
            localStorage.removeItem('platex_settings');
            alert('Data cleared.');
            window.location.reload();
        }
    };

    return (
        <div className="flex min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white">
            <Sidebar />
            <main className="flex-1 flex flex-col p-4 md:p-8 overflow-y-auto h-screen">
                <div className="w-full max-w-3xl mx-auto pt-8">
                    <header className="mb-8">
                        <h2 className="text-3xl font-bold text-white mb-2">Settings</h2>
                        <p className="text-gray-400">Manage your preferences and account.</p>
                    </header>

                    <div className="space-y-6">
                        {/* Preferences */}
                        <section className="bg-gray-800/30 backdrop-blur-md border border-gray-700/50 rounded-2xl overflow-hidden">
                            <div className="p-6 border-b border-gray-700/50">
                                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                                    <SettingsIcon size={20} className="text-blue-400" /> General
                                </h3>
                            </div>
                            <div className="p-6 space-y-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="font-medium text-white">Unit System</p>
                                        <p className="text-sm text-gray-400">Select your preferred measurement units</p>
                                    </div>
                                    <div className="flex bg-gray-900 rounded-lg p-1 border border-gray-700">
                                        <button
                                            onClick={() => changeSetting('units', 'metric')}
                                            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${settings.units === 'metric' ? 'bg-gray-700 text-white shadow-sm' : 'text-gray-400 hover:text-white'}`}
                                        >
                                            Metric
                                        </button>
                                        <button
                                            onClick={() => changeSetting('units', 'imperial')}
                                            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${settings.units === 'imperial' ? 'bg-gray-700 text-white shadow-sm' : 'text-gray-400 hover:text-white'}`}
                                        >
                                            Imperial
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Notifications */}
                        <section className="bg-gray-800/30 backdrop-blur-md border border-gray-700/50 rounded-2xl overflow-hidden">
                            <div className="p-6 border-b border-gray-700/50">
                                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                                    <Bell size={20} className="text-yellow-400" /> Notifications
                                </h3>
                            </div>
                            <div className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="font-medium text-white">Daily Reminders</p>
                                        <p className="text-sm text-gray-400">Receive reminders to log your meals</p>
                                    </div>
                                    <button
                                        onClick={() => toggleSetting('notifications')}
                                        className={`w-12 h-6 rounded-full transition-colors relative ${settings.notifications ? 'bg-blue-600' : 'bg-gray-700'}`}
                                    >
                                        <span className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${settings.notifications ? 'translate-x-6' : 'translate-x-0'}`} />
                                    </button>
                                </div>
                            </div>
                        </section>

                        {/* Data & Privacy */}
                        <section className="bg-gray-800/30 backdrop-blur-md border border-gray-700/50 rounded-2xl overflow-hidden">
                            <div className="p-6 border-b border-gray-700/50">
                                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                                    <Shield size={20} className="text-green-400" /> Data & Privacy
                                </h3>
                            </div>
                            <div className="p-6 space-y-4">
                                <button
                                    onClick={() => window.open('/report', '_blank')}
                                    className="w-full flex items-center justify-between p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl hover:bg-blue-500/20 transition-colors group"
                                >
                                    <div className="flex items-center gap-3">
                                        <Bell size={20} className="text-blue-400" />
                                        {/* Reusing Bell icon for now or similar */}
                                        <div className="text-left">
                                            <p className="font-medium text-blue-200">Download Weekly Report</p>
                                            <p className="text-sm text-blue-400/70">Get a PDF summary of your progress</p>
                                        </div>
                                    </div>
                                    <ChevronRight size={20} className="text-blue-400/50 group-hover:translate-x-1 transition-transform" />
                                </button>

                                <button
                                    onClick={clearData}
                                    className="w-full flex items-center justify-between p-4 bg-red-500/10 border border-red-500/20 rounded-xl hover:bg-red-500/20 transition-colors group"
                                >
                                    <div className="flex items-center gap-3">
                                        <Trash2 size={20} className="text-red-400" />
                                        <div className="text-left">
                                            <p className="font-medium text-red-200">Clear All Data</p>
                                            <p className="text-sm text-red-400/70">Remove all local data and reset app</p>
                                        </div>
                                    </div>
                                    <ChevronRight size={20} className="text-red-400/50 group-hover:translate-x-1 transition-transform" />
                                </button>
                            </div>
                        </section>

                        <div className="text-center text-gray-500 text-sm pt-8">
                            <p>PlateX v1.0.0</p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
