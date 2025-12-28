'use client';

import { useState, useEffect } from 'react';
import { Network } from '@capacitor/network';
import { WifiOff } from 'lucide-react';

export default function OfflineBanner() {
    const [isOnline, setIsOnline] = useState(true);

    useEffect(() => {
        // Check initial status
        Network.getStatus().then(status => {
            setIsOnline(status.connected);
        });

        // Listen for changes
        const listener = Network.addListener('networkStatusChange', status => {
            setIsOnline(status.connected);
        });

        return () => {
            listener.then(handle => handle.remove());
        };
    }, []);

    if (isOnline) return null;

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-red-600 text-white p-3 z-[100] flex items-center justify-center gap-2 animate-in slide-in-from-bottom duration-300">
            <WifiOff className="w-5 h-5" />
            <span className="text-sm font-medium">No Internet Connection. Some features may be unavailable.</span>
        </div>
    );
}
