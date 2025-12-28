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
            if (pathname === '/login') {
                App.exitApp();
            } else if (pathname === '/') {
                App.exitApp();
            } else {
                // If we are deep in a tab, go HOME first instead of just "back" in history
                // This ensures users don't get stuck in a history loop
                router.push('/');
            }
        });

        return () => {
            listener.then(handle => handle.remove());
        };
    }, [pathname, router]);

    return null;
}
