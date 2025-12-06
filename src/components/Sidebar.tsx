'use client';

import HistoryList from './HistoryList';
import { LayoutDashboard, Settings, User, ChefHat, X, Utensils, ShoppingCart, Camera } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface SidebarProps {
    onSelectLog?: (log: any) => void;
    refreshTrigger?: number;
    isOpen?: boolean;
    onClose?: () => void;
}

export default function Sidebar({ onSelectLog, refreshTrigger, isOpen, onClose }: SidebarProps) {
    const pathname = usePathname();

    const isActive = (path: string) => pathname === path;

    return (
        <>
            {/* Mobile Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
                    onClick={onClose}
                />
            )}

            <aside className={`
                fixed md:sticky top-0 h-screen w-80 bg-black/20 border-r border-gray-800 p-6 flex flex-col overflow-y-auto backdrop-blur-xl z-50 transition-transform duration-300 ease-in-out
                ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
            `}>
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <div className="flex items-center gap-2 mb-1 group">
                            <div className="relative w-10 h-10 flex items-center justify-center">
                                {/* Animated Rings */}
                                <div className="absolute inset-0 rounded-full border-2 border-green-400 border-t-transparent animate-[spin_3s_linear_infinite]" />
                                <div className="absolute inset-1 rounded-full border-2 border-blue-500 border-b-transparent animate-[spin_2s_linear_infinite_reverse]" />
                                {/* Center Icon */}
                                <ChefHat className="text-white w-5 h-5 relative z-10 animate-pulse" />
                            </div>
                            <h1 className="text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-blue-500 tracking-tight group-hover:scale-105 transition-transform duration-300">
                                PlateX
                            </h1>
                        </div>
                        <p className="text-xs text-gray-500 ml-1 font-medium tracking-wide">AI Nutrition Tracker</p>
                    </div>
                    {/* Mobile Close Button */}
                    <button onClick={onClose} className="md:hidden text-gray-400 hover:text-white">
                        <X size={24} />
                    </button>
                </div>

                <nav className="space-y-2 mb-8" suppressHydrationWarning={true}>
                    {/* Navigation Links */}
                    <Link href="/" className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive('/')
                        ? 'bg-gray-800/50 text-white border border-gray-700/50 shadow-sm'
                        : 'text-gray-400 hover:text-white hover:bg-gray-800/30'
                        }`}>
                        <LayoutDashboard size={20} className={isActive('/') ? "text-green-400" : ""} />
                        <span className="font-medium">Dashboard</span>
                    </Link>

                    <Link href="/planner" className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive('/planner')
                        ? 'bg-gray-800/50 text-white border border-gray-700/50 shadow-sm'
                        : 'text-gray-400 hover:text-white hover:bg-gray-800/30'
                        }`}>
                        <Utensils size={20} className={isActive('/planner') ? "text-blue-400" : ""} />
                        <span className="font-medium">Diet Planner</span>
                    </Link>

                    <Link href="/profile" className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive('/profile')
                        ? 'bg-gray-800/50 text-white border border-gray-700/50 shadow-sm'
                        : 'text-gray-400 hover:text-white hover:bg-gray-800/30'
                        }`}>
                        <User size={20} className={isActive('/profile') ? "text-purple-400" : ""} />
                        <span className="font-medium">Profile</span>
                    </Link>

                    <Link href="/fridge" className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive('/fridge')
                        ? 'bg-gray-800/50 text-white border border-gray-700/50 shadow-sm'
                        : 'text-gray-400 hover:text-white hover:bg-gray-800/30'
                        }`}>
                        <ChefHat size={20} className={isActive('/fridge') ? "text-pink-400" : ""} />
                        <span className="font-medium">Chef AI</span>
                    </Link>

                    <Link href="/shopping-list" className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive('/shopping-list')
                        ? 'bg-gray-800/50 text-white border border-gray-700/50 shadow-sm'
                        : 'text-gray-400 hover:text-white hover:bg-gray-800/30'
                        }`}>
                        <ShoppingCart size={20} className={isActive('/shopping-list') ? "text-yellow-400" : ""} />
                        <span className="font-medium">Shopping List</span>
                    </Link>

                    <Link href="/progress" className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive('/progress')
                        ? 'bg-gray-800/50 text-white border border-gray-700/50 shadow-sm'
                        : 'text-gray-400 hover:text-white hover:bg-gray-800/30'
                        }`}>
                        <Camera size={20} className={isActive('/progress') ? "text-purple-400" : ""} />
                        <span className="font-medium">Timeline</span>
                    </Link>

                    <Link href="/settings" className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive('/settings')
                        ? 'bg-gray-800/50 text-white border border-gray-700/50 shadow-sm'
                        : 'text-gray-400 hover:text-white hover:bg-gray-800/30'
                        }`}>
                        <Settings size={20} className={isActive('/settings') ? "text-orange-400" : ""} />
                        <span className="font-medium">Settings</span>
                    </Link>
                </nav>

                <div className="flex-1 overflow-y-auto">
                    {/* Only show history on Dashboard or if we want it global. 
                        For now, let's keep it global but maybe hide it if on other pages? 
                        Actually, keeping it is fine, but onSelectLog might need handling if not on home.
                    */}
                    {onSelectLog && refreshTrigger !== undefined && (
                        <HistoryList onSelect={(log) => {
                            onSelectLog(log);
                            if (onClose) onClose();
                        }} refreshTrigger={refreshTrigger} />
                    )}
                </div>
            </aside>
        </>
    );
}
