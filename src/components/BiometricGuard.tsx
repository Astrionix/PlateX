'use client';

import { useEffect, useState } from 'react';
import { BiometricAuth } from '@aparajita/capacitor-biometric-auth';
import { Lock, Fingerprint } from 'lucide-react';
import { Capacitor } from '@capacitor/core';

export default function BiometricGuard({ children }: { children: React.ReactNode }) {
    const [isLocked, setIsLocked] = useState(false);
    const [isAvailable, setIsAvailable] = useState(false);
    const [checking, setChecking] = useState(true);

    useEffect(() => {
        // Only run on native platforms
        if (!Capacitor.isNativePlatform()) {
            setChecking(false);
            return;
        }

        const checkBiometrics = async () => {
            try {
                const info = await BiometricAuth.checkBiometry();

                if (info.isAvailable) {
                    setIsAvailable(true);
                    // Only lock if user is already logged in? 
                    // For now, let's just lock the app launch for everyone
                    // But wait, if they need to signup/login, we shouldn't block them.
                    // Let's check session existence?
                    // For now, simple "App Lock" behavior.
                    setIsLocked(true);
                    promptBiometric();
                }
            } catch (error) {
                console.error('Biometric check failed', error);
            } finally {
                setChecking(false);
            }
        };

        checkBiometrics();

        // Lock on resume
        /*
        const resumeListener = App.addListener('appStateChange', ({ isActive }) => {
          if (isActive && isAvailable) {
            setIsLocked(true);
            promptBiometric();
          }
        });
    
        return () => {
          resumeListener.then(h => h.remove());
        };
        */
    }, []);

    const promptBiometric = async () => {
        try {
            await BiometricAuth.authenticate({
                reason: 'Unlock PlateX',
                cancelTitle: 'Cancel',
                allowDeviceCredential: true, // Allow PIN/Pattern if FaceID fails
                iosFallbackTitle: 'Use PIN'
            });

            // If code reaches here, authentication was successful
            setIsLocked(false);
        } catch (error) {
            console.error('Authentication failed', error);
            // If user cancels, we stay locked.
        }
    };

    if (checking) return null; // Or a splash screen

    if (isLocked) {
        return (
            <div className="fixed inset-0 bg-black z-[9999] flex flex-col items-center justify-center p-8">
                <div className="w-20 h-20 rounded-full bg-gray-900 border border-gray-800 flex items-center justify-center mb-6 animate-pulse">
                    <Lock className="w-8 h-8 text-green-500" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">App Locked</h2>
                <p className="text-gray-400 text-center mb-8">Authentication required to access PlateX</p>

                <button
                    onClick={promptBiometric}
                    className="flex items-center gap-2 bg-green-600 hover:bg-green-500 text-white px-6 py-3 rounded-xl font-bold transition-all active:scale-95"
                >
                    <Fingerprint className="w-5 h-5" />
                    Unlock with Face ID
                </button>
            </div>
        );
    }

    return <>{children}</>;
}
