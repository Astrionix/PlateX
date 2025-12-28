import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/components/AuthProvider";
import ChatAssistant from "@/components/ChatAssistant";
import VoiceCommandCenter from "@/components/VoiceCommandCenter";
import OfflineBanner from "@/components/OfflineBanner";
import BiometricGuard from "@/components/BiometricGuard";
import AndroidBackHandler from "@/components/AndroidBackHandler";
import MobileHeader from "@/components/MobileHeader";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  viewportFit: 'cover',
};

export const metadata: Metadata = {
  title: "PlateX - AI Food Analyzer",
  description: "Analyze your food with AI and track your nutrition.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <AuthProvider>
          <BiometricGuard>
            <AndroidBackHandler />
            <OfflineBanner />
            <MobileHeader onMenuClick={() => {
              // Dispatch event for Sidebar to pick up
              if (typeof window !== 'undefined') {
                window.dispatchEvent(new CustomEvent('toggleSidebar'));
              }
            }} />
            <VoiceCommandCenter />
            {children}
          </BiometricGuard>
          <ChatAssistant />
        </AuthProvider>
      </body>
    </html>
  );
}
