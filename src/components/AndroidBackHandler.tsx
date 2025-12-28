'use client';

import { useEffect } from 'react';
import { App } from '@capacitor/app';
import { useRouter, usePathname } from 'next/navigation';
import { Capacitor } from '@capacitor/core';

export default function AndroidBackHandler() {
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        if (!Capacitor.isNativePlatform()) return;

        let lastBackPress = 0;

        const listener = App.addListener('backButton', ({ canGoBack }) => {
            const now = Date.now();

            // If we are on the root path or login, exit the app
            if (pathname === '/' || pathname === '/login') {
                // Prevent accidental exits: require simple double tap or just exit?
                // Standard Android behavior is exit on root
                App.exitApp();
            } else {
                // Otherwise go back in history
                router.back();
            }
        });

        return () => {
            listener.then(handle => handle.remove());
        };
    }, [pathname, router]);

    return null;
}
