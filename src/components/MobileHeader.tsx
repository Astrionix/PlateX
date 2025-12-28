'use client';

import { ArrowLeft, Menu, MoreVertical } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Capacitor } from '@capacitor/core';

interface MobileHeaderProps {
    onMenuClick: () => void;
}

export default function MobileHeader({ onMenuClick }: MobileHeaderProps) {
    const pathname = usePathname();
    const router = useRouter();
    const [scrolled, setScrolled] = useState(false);

    // Track scroll for extra glass effect intensity
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Don't show on login/signup/onboarding
    if (['/login', '/signup', '/onboarding'].includes(pathname)) return null;

    const isHome = pathname === '/';

    const getPageTitle = (path: string) => {
        if (path === '/') return 'Dashboard';

        // Remove leading slash and split by slash
        const parts = path.substring(1).split('/');

        // Handle specific known routes for cleaner titles
        const section = parts[0];
        switch (section) {
            case 'planner': return 'Diet Planner';
            case 'ar-menu': return 'AR Menu X-Ray';
            case 'social': return 'Social Hub';
            case 'body-tracker': return 'Body Projector';
            case 'chef-mode': return 'Chef Mode';
            case 'meal-prep': return 'Meal Prep';
            case 'fridge': return 'Chef AI';
            case 'shopping-list': return 'Shopping List';
            case 'progress': return 'Results & Progress';
            case 'settings': return 'Settings';
            case 'premium': return 'Premium';
            default: return section.charAt(0).toUpperCase() + section.slice(1);
        }
    };

    return (
        <header
            className={`
                md:hidden sticky top-0 z-[49] transition-all duration-300
                px-4 py-4 flex items-center justify-between
                ${scrolled
                    ? 'bg-black/60 backdrop-blur-xl border-b border-white/5 shadow-lg shadow-black/20'
                    : 'bg-transparent'
                }
                ${isHome ? 'pt-safe-top' : ''} 
            `}
        >
            {/* Left Action: Back or Menu */}
            <div className="flex items-center gap-2">
                {isHome ? (
                    <button
                        onClick={onMenuClick}
                        className="p-2 -ml-2 rounded-full hover:bg-white/10 active:bg-white/20 transition-colors"
                    >
                        <Menu className="w-6 h-6 text-white" />
                    </button>
                ) : (
                    <button
                        onClick={() => router.back()}
                        className="p-2 -ml-2 rounded-full hover:bg-white/10 active:bg-white/20 transition-colors group"
                    >
                        <ArrowLeft className="w-6 h-6 text-white group-active:-translate-x-1 transition-transform" />
                    </button>
                )}
            </div>

            {/* Center Title */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2">
                <h1 className="text-lg font-bold text-white tracking-wide opacity-90">
                    {getPageTitle(pathname)}
                </h1>
            </div>

            {/* Right Action: Placeholder or Context Menu */}
            <div className="flex items-center gap-2">
                <button className="p-2 -mr-2 rounded-full hover:bg-white/10 active:bg-white/20 transition-colors">
                    <MoreVertical className="w-6 h-6 text-white opacity-0" /> {/* Invisible spacer for balance, or make specific actions */}
                </button>
            </div>
        </header>
    );
}
