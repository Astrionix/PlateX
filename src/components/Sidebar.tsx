'use client';

import HistoryList from './HistoryList';
import { LayoutDashboard, Settings, User, ChefHat, X, Utensils, ShoppingCart, TrendingUp, LogOut, LogIn, Flame, Crown, Scan } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from './AuthProvider';

interface SidebarProps {
    onSelectLog?: (log: any) => void;
    refreshTrigger?: number;
    isOpen?: boolean;
    onClose?: () => void;
}

export default function Sidebar({ onSelectLog, refreshTrigger, isOpen, onClose }: SidebarProps) {
    const pathname = usePathname();
    const { user, signOut } = useAuth();

    const isActive = (path: string) => pathname === path;

    const navItems = [
        { href: '/', icon: LayoutDashboard, label: 'Dashboard', color: 'green' },
        { href: '/planner', icon: Utensils, label: 'Diet Planner', color: 'blue' },
        { href: '/ar-menu', icon: Scan, label: 'AR Menu X-Ray', color: 'pink', badge: 'AR' },
        { href: '/social', icon: Crown, label: 'Social Hub', color: 'yellow', badge: 'NEW' },
        { href: '/body-tracker', icon: User, label: 'Body Projector', color: 'cyan', badge: '3D' },
        { href: '/chef-mode/demo', icon: ChefHat, label: 'Chef Mode', color: 'emerald', badge: 'AI' },
        { href: '/meal-prep', icon: Utensils, label: 'Meal Prep', color: 'purple' },
        { href: '/fridge', icon: ChefHat, label: 'Chef AI', color: 'orange' },
        { href: '/shopping-list', icon: ShoppingCart, label: 'Shopping', color: 'blue' },
        { href: '/progress', icon: TrendingUp, label: 'Progress', color: 'pink' },
        { href: '/settings', icon: Settings, label: 'Settings', color: 'gray' },
    ];

    const colorMap: Record<string, { active: string; icon: string; border: string }> = {
        green: { active: 'from-green-500/20 to-green-600/10', icon: 'text-green-400', border: 'border-green-500/50' },
        blue: { active: 'from-blue-500/20 to-blue-600/10', icon: 'text-blue-400', border: 'border-blue-500/50' },
        emerald: { active: 'from-emerald-500/20 to-emerald-600/10', icon: 'text-emerald-400', border: 'border-emerald-500/50' },
        purple: { active: 'from-purple-500/20 to-purple-600/10', icon: 'text-purple-400', border: 'border-purple-500/50' },
        orange: { active: 'from-orange-500/20 to-orange-600/10', icon: 'text-orange-400', border: 'border-orange-500/50' },
        yellow: { active: 'from-yellow-500/20 to-yellow-600/10', icon: 'text-yellow-400', border: 'border-yellow-500/50' },
        gray: { active: 'from-gray-500/20 to-gray-600/10', icon: 'text-gray-400', border: 'border-gray-500/50' },
        pink: { active: 'from-pink-500/20 to-pink-600/10', icon: 'text-pink-400', border: 'border-pink-500/50' },
        cyan: { active: 'from-cyan-500/20 to-cyan-600/10', icon: 'text-cyan-400', border: 'border-cyan-500/50' },
    };

    return (
        <>
            {/* Mobile Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 md:hidden"
                    onClick={onClose}
                />
            )}

            <aside className={`
                fixed md:sticky top-0 h-screen w-72 bg-gradient-to-b from-gray-900/95 to-black/95 border-r border-gray-800/50 flex flex-col backdrop-blur-xl z-50 transition-transform duration-300 ease-in-out
                ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
            `}>
                {/* Logo Header */}
                <div className="p-6 border-b border-gray-800/50">
                    <div className="flex items-center justify-between">
                        <Link href="/" className="flex items-center gap-3 group">
                            <div className="relative w-11 h-11 flex items-center justify-center">
                                {/* Animated Glow */}
                                <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-green-500 to-blue-600 opacity-20 group-hover:opacity-40 blur-md transition-opacity" />
                                {/* Icon Container */}
                                <div className="relative w-full h-full rounded-xl bg-gradient-to-br from-green-500 to-blue-600 flex items-center justify-center shadow-lg">
                                    <ChefHat className="text-white w-6 h-6" />
                                </div>
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-white tracking-tight">PlateX</h1>
                                <p className="text-[10px] text-gray-500 uppercase tracking-widest font-medium">AI Nutrition</p>
                            </div>
                        </Link>
                        {/* Mobile Close Button */}
                        <button onClick={onClose} className="md:hidden p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-all">
                            <X size={20} />
                        </button>
                    </div>
                </div>

                {/* User Card (if logged in) */}
                {user && (
                    <div className="px-4 py-3 mx-3 mt-4 bg-gray-800/30 rounded-xl border border-gray-700/30">
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-green-500 to-blue-600 flex items-center justify-center text-white font-bold text-sm">
                                {user.email?.charAt(0).toUpperCase()}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-white truncate">{user.email?.split('@')[0]}</p>
                                <p className="text-xs text-gray-500 flex items-center gap-1">
                                    <Crown size={10} className="text-yellow-400" /> Pro Member
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Navigation */}
                <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto" suppressHydrationWarning={true}>
                    <p className="px-3 py-2 text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Menu</p>

                    {navItems.map((item) => {
                        const colors = colorMap[item.color];
                        const active = isActive(item.href);
                        const Icon = item.icon;

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={onClose}
                                prefetch={true}
                                className={`
                                    flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group relative
                                    ${active
                                        ? `bg-gradient-to-r ${colors.active} border ${colors.border} text-white shadow-sm`
                                        : 'text-gray-400 hover:text-white hover:bg-gray-800/40'
                                    }
                                `}
                            >
                                <Icon size={18} className={`${active ? colors.icon : 'group-hover:text-gray-300'} transition-colors`} />
                                <span className="font-medium text-sm">{item.label}</span>
                                {item.badge && (
                                    <span className="ml-auto text-[10px] font-bold px-2 py-0.5 rounded-full bg-gradient-to-r from-green-500 to-emerald-600 text-white">
                                        {item.badge}
                                    </span>
                                )}
                                {active && (
                                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-r-full bg-gradient-to-b from-green-400 to-blue-500" />
                                )}
                            </Link>
                        );
                    })}

                    {/* History Section */}
                    {onSelectLog && refreshTrigger !== undefined && (
                        <div className="mt-6">
                            <p className="px-3 py-2 text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Recent Logs</p>
                            <HistoryList
                                key={user?.id || 'guest'}
                                onSelect={(log) => {
                                    onSelectLog(log);
                                    if (onClose) onClose();
                                }}
                                refreshTrigger={refreshTrigger}
                            />
                        </div>
                    )}
                </nav>

                {/* Auth Footer */}
                <div className="p-4 border-t border-gray-800/50">
                    {user ? (
                        <button
                            onClick={async () => {
                                await signOut();
                                if (onClose) onClose();
                            }}
                            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-gray-400 hover:text-red-400 hover:bg-red-500/10 border border-transparent hover:border-red-500/30 transition-all group"
                        >
                            <LogOut size={18} className="group-hover:scale-110 transition-transform" />
                            <span className="font-medium text-sm">Sign Out</span>
                        </button>
                    ) : (
                        <Link
                            href="/login"
                            onClick={onClose}
                            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-white bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-400 hover:to-blue-500 transition-all font-medium text-sm shadow-lg shadow-green-900/30 hover:shadow-green-900/50"
                        >
                            <LogIn size={18} />
                            Sign In
                        </Link>
                    )}
                </div>
            </aside>
        </>
    );
}
