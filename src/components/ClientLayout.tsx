'use client';

import AndroidBackHandler from "@/components/AndroidBackHandler";
import BiometricGuard from "@/components/BiometricGuard";
import MobileHeader from "@/components/MobileHeader";
import OfflineBanner from "@/components/OfflineBanner";
import VoiceCommandCenter from "@/components/VoiceCommandCenter";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
    return (
        <BiometricGuard>
            <AndroidBackHandler />
            <OfflineBanner />
            <MobileHeader onMenuClick={() => {
                if (typeof window !== 'undefined') {
                    window.dispatchEvent(new CustomEvent('toggleSidebar'));
                }
            }} />
            <VoiceCommandCenter />
            {children}
        </BiometricGuard>
    );
}
