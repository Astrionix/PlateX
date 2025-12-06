'use client';

import { useState } from 'react';
import UploadCard from '@/components/UploadCard';
import ResultsCard from '@/components/ResultsCard';
import ThreeBackground from '@/components/ThreeBackground';
import StreakCounter from '@/components/StreakCounter';
import AnalyticsChart from '@/components/AnalyticsChart';
import HydrationTracker from '@/components/HydrationTracker';
import CalendarView from '@/components/CalendarView';
import Sidebar from '@/components/Sidebar';
import { Menu } from 'lucide-react';

export default function Home() {
  const [result, setResult] = useState<any>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleResult = (data: any) => {
    setResult(data);
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="flex min-h-screen relative text-white overflow-hidden">
      <ThreeBackground />
      <Sidebar
        onSelectLog={setResult}
        refreshTrigger={refreshTrigger}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      <main className="flex-1 flex flex-col p-4 md:p-8 overflow-y-auto h-screen relative z-10">
        <div className="w-full max-w-4xl mx-auto pt-4 md:pt-8">
          <header className="mb-8 md:mb-12 flex items-center gap-4">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="md:hidden p-2 hover:bg-gray-800 rounded-lg transition-colors"
            >
              <Menu className="w-6 h-6 text-white" />
            </button>
            <div>
              {/* Removed Header */}
            </div>
            <div className="ml-auto hidden md:block">
              <StreakCounter />
            </div>
          </header>

          <div className="transition-all duration-500 ease-in-out">
            {result ? (
              <ResultsCard result={result} onReset={() => setResult(null)} />
            ) : (
              <UploadCard onResult={handleResult} />
            )}
          </div>

          {/* Analytics Section (Show when not viewing a result) */}
          {!result && (
            <div className="space-y-6 pb-8">
              <div className="grid md:grid-cols-2 gap-6">
                <HydrationTracker />
                <CalendarView />
              </div>
              <AnalyticsChart />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
