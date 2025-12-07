'use client';

import { useState, useEffect } from 'react';
import { Sun, Moon, Monitor } from 'lucide-react';

type Theme = 'light' | 'dark' | 'system';

export default function ThemeToggle() {
    const [theme, setTheme] = useState<Theme>('dark');

    useEffect(() => {
        const savedTheme = localStorage.getItem('platex_theme') as Theme;
        if (savedTheme) {
            setTheme(savedTheme);
            applyTheme(savedTheme);
        }
    }, []);

    const applyTheme = (newTheme: Theme) => {
        const root = document.documentElement;

        if (newTheme === 'system') {
            const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            root.classList.toggle('dark', systemDark);
            root.classList.toggle('light', !systemDark);
        } else {
            root.classList.toggle('dark', newTheme === 'dark');
            root.classList.toggle('light', newTheme === 'light');
        }
    };

    const handleChange = (newTheme: Theme) => {
        setTheme(newTheme);
        localStorage.setItem('platex_theme', newTheme);
        applyTheme(newTheme);
    };

    const options: { value: Theme; icon: any; label: string }[] = [
        { value: 'light', icon: Sun, label: 'Light' },
        { value: 'dark', icon: Moon, label: 'Dark' },
        { value: 'system', icon: Monitor, label: 'System' },
    ];

    return (
        <div className="flex bg-gray-800/50 rounded-xl p-1">
            {options.map(option => {
                const Icon = option.icon;
                const isActive = theme === option.value;

                return (
                    <button
                        key={option.value}
                        onClick={() => handleChange(option.value)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${isActive
                                ? 'bg-gradient-to-r from-green-500 to-blue-600 text-white'
                                : 'text-gray-400 hover:text-white'
                            }`}
                    >
                        <Icon size={16} />
                        {option.label}
                    </button>
                );
            })}
        </div>
    );
}
