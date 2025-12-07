'use client';

import { useState, useEffect } from 'react';
import UploadCard from '@/components/UploadCard';
import ResultsCard from '@/components/ResultsCard';
import ThreeBackground from '@/components/ThreeBackground';
import StreakCounter from '@/components/StreakCounter';
import AnalyticsChart from '@/components/AnalyticsChart';
import HydrationTracker from '@/components/HydrationTracker';
import CalendarView from '@/components/CalendarView';
import MacroProgressRings from '@/components/MacroProgressRings';
import ChallengesQuests from '@/components/ChallengesQuests';
import WeeklyReportCard from '@/components/WeeklyReportCard';
import Sidebar from '@/components/Sidebar';
import { Menu, Sparkles, TrendingUp, ChefHat, Target, Calendar, Crown } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/components/AuthProvider';
import { supabase } from '@/lib/supabaseClient';

export default function Home() {
  const { user } = useAuth();
  const [result, setResult] = useState<any>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [todayMacros, setTodayMacros] = useState({
    calories: { current: 0, target: 2000 },
    protein: { current: 0, target: 150 },
    carbs: { current: 0, target: 250 },
    fat: { current: 0, target: 65 },
  });

  // Fetch today's logged macros
  useEffect(() => {
    const fetchTodayMacros = async () => {
      if (!user) return;

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const { data: logs } = await supabase
        .from('food_logs')
        .select('total_calories, total_protein, total_carbs, total_fat')
        .eq('user_id', user.id)
        .gte('created_at', today.toISOString());

      if (logs && logs.length > 0) {
        const totals = logs.reduce((acc, log) => ({
          calories: acc.calories + (log.total_calories || 0),
          protein: acc.protein + (log.total_protein || 0),
          carbs: acc.carbs + (log.total_carbs || 0),
          fat: acc.fat + (log.total_fat || 0),
        }), { calories: 0, protein: 0, carbs: 0, fat: 0 });

        // Load targets from profile
        const profile = JSON.parse(localStorage.getItem('platex_profile') || '{}');
        const targets = profile.dailyTargets || { calories: 2000, protein: 150, carbs: 250, fat: 65 };

        setTodayMacros({
          calories: { current: Math.round(totals.calories), target: targets.calories },
          protein: { current: Math.round(totals.protein), target: targets.protein },
          carbs: { current: Math.round(totals.carbs), target: targets.carbs },
          fat: { current: Math.round(totals.fat), target: targets.fat },
        });
      }
    };

    fetchTodayMacros();
  }, [user, refreshTrigger]);

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
        <div className="w-full max-w-6xl mx-auto pt-4 md:pt-8">
          {/* Header */}
          <header className="mb-8 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="md:hidden p-2 hover:bg-gray-800 rounded-lg transition-colors"
              >
                <Menu className="w-6 h-6 text-white" />
              </button>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-blue-500">
                  {user ? `Welcome back!` : 'PlateX Dashboard'}
                </h1>
                <p className="text-gray-400 text-sm mt-1">
                  {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                </p>
              </div>
            </div>
            <div className="hidden md:block">
              <StreakCounter />
            </div>
          </header>

          {/* Main Content */}
          <div className="space-y-6">
            {/* Upload/Results Card */}
            <div className="transition-all duration-500 ease-in-out">
              {result ? (
                <ResultsCard result={result} onReset={() => setResult(null)} />
              ) : (
                <UploadCard onResult={handleResult} />
              )}
            </div>

            {/* Dashboard Widgets */}
            {!result && (
              <>
                {/* Macro Progress Rings - Full Width */}
                <MacroProgressRings {...todayMacros} />

                {/* Quick Actions Row */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  <Link href="/fridge" className="group">
                    <div className="bg-gradient-to-br from-green-900/40 to-emerald-900/40 backdrop-blur border border-green-500/30 rounded-2xl p-5 hover:border-green-400/50 transition-all hover:scale-[1.02]">
                      <ChefHat className="w-8 h-8 text-green-400 mb-3 group-hover:scale-110 transition-transform" />
                      <h3 className="font-bold text-white">Chef AI</h3>
                      <p className="text-gray-400 text-xs mt-1">Generate recipes</p>
                    </div>
                  </Link>
                  <Link href="/meal-prep" className="group">
                    <div className="bg-gradient-to-br from-cyan-900/40 to-teal-900/40 backdrop-blur border border-cyan-500/30 rounded-2xl p-5 hover:border-cyan-400/50 transition-all hover:scale-[1.02]">
                      <Calendar className="w-8 h-8 text-cyan-400 mb-3 group-hover:scale-110 transition-transform" />
                      <h3 className="font-bold text-white">Meal Prep</h3>
                      <p className="text-gray-400 text-xs mt-1">Weekly planning</p>
                    </div>
                  </Link>
                  <Link href="/planner" className="group">
                    <div className="bg-gradient-to-br from-blue-900/40 to-indigo-900/40 backdrop-blur border border-blue-500/30 rounded-2xl p-5 hover:border-blue-400/50 transition-all hover:scale-[1.02]">
                      <Target className="w-8 h-8 text-blue-400 mb-3 group-hover:scale-110 transition-transform" />
                      <h3 className="font-bold text-white">Diet Planner</h3>
                      <p className="text-gray-400 text-xs mt-1">AI meal plans</p>
                    </div>
                  </Link>
                  <Link href="/progress" className="group">
                    <div className="bg-gradient-to-br from-purple-900/40 to-pink-900/40 backdrop-blur border border-purple-500/30 rounded-2xl p-5 hover:border-purple-400/50 transition-all hover:scale-[1.02]">
                      <TrendingUp className="w-8 h-8 text-purple-400 mb-3 group-hover:scale-110 transition-transform" />
                      <h3 className="font-bold text-white">Progress</h3>
                      <p className="text-gray-400 text-xs mt-1">Track journey</p>
                    </div>
                  </Link>
                  <Link href="/premium" className="group">
                    <div className="bg-gradient-to-br from-yellow-900/40 to-amber-900/40 backdrop-blur border border-yellow-500/30 rounded-2xl p-5 hover:border-yellow-400/50 transition-all hover:scale-[1.02]">
                      <Crown className="w-8 h-8 text-yellow-400 mb-3 group-hover:scale-110 transition-transform" />
                      <h3 className="font-bold text-white">Premium</h3>
                      <p className="text-gray-400 text-xs mt-1">Upgrade now</p>
                    </div>
                  </Link>
                </div>

                {/* Stats Row */}
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="md:col-span-1">
                    <HydrationTracker />
                  </div>
                  <div className="md:col-span-2">
                    <CalendarView />
                  </div>
                </div>

                {/* Challenges & Weekly Report */}
                <div className="grid md:grid-cols-2 gap-6">
                  <ChallengesQuests />
                  <WeeklyReportCard />
                </div>

                {/* Analytics Chart */}
                <AnalyticsChart />
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
