'use client';

import AndroidBackHandler from "@/components/AndroidBackHandler";
import BiometricGuard from "@/components/BiometricGuard";

import OfflineBanner from "@/components/OfflineBanner";
import VoiceCommandCenter from "@/components/VoiceCommandCenter";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
    return (
        <BiometricGuard>
            <AndroidBackHandler />
            <OfflineBanner />
            <VoiceCommandCenter />
            {children}
        </BiometricGuard>
    );
}
