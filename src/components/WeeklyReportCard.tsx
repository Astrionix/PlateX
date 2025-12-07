'use client';

import { useState, useEffect } from 'react';
import { FileText, Loader2, Download, CheckCircle } from 'lucide-react';

interface WeeklyReportData {
    stats: {
        totalMeals: number;
        avgCalories: number;
        avgProtein: number;
        avgCarbs: number;
        avgFat: number;
        totalCalories: number;
        totalProtein: number;
        healthScoreAvg: number;
    };
    aiSummary: string;
    weekStart: string;
    weekEnd: string;
}

export default function WeeklyReportCard() {
    const [report, setReport] = useState<WeeklyReportData | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchReport = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch('/api/weekly-report');
            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Failed to fetch report');
            }

            setReport(data);
        } catch (err: any) {
            setError(err.message || 'Failed to load report');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReport();
    }, []);

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };

    return (
        <div className="bg-gradient-to-br from-purple-900/40 to-blue-900/40 backdrop-blur border border-purple-500/30 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <FileText className="text-purple-400" /> Weekly Report
                </h3>
                {report && (
                    <span className="text-xs text-gray-400">
                        {formatDate(report.weekStart)} - {formatDate(report.weekEnd)}
                    </span>
                )}
            </div>

            {loading ? (
                <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-8 h-8 text-purple-400 animate-spin" />
                </div>
            ) : error ? (
                <div className="text-center py-8">
                    <p className="text-red-400 text-sm mb-4">{error}</p>
                    <button
                        onClick={fetchReport}
                        className="text-purple-400 hover:text-purple-300 text-sm font-medium"
                    >
                        Try Again
                    </button>
                </div>
            ) : report ? (
                <>
                    {/* Stats Grid */}
                    <div className="grid grid-cols-4 gap-3 mb-6">
                        <div className="bg-gray-900/50 rounded-xl p-3 text-center">
                            <p className="text-2xl font-bold text-white">{report.stats.totalMeals}</p>
                            <p className="text-xs text-gray-500">Meals</p>
                        </div>
                        <div className="bg-gray-900/50 rounded-xl p-3 text-center">
                            <p className="text-2xl font-bold text-green-400">{report.stats.avgCalories}</p>
                            <p className="text-xs text-gray-500">Avg Cal</p>
                        </div>
                        <div className="bg-gray-900/50 rounded-xl p-3 text-center">
                            <p className="text-2xl font-bold text-blue-400">{report.stats.avgProtein}g</p>
                            <p className="text-xs text-gray-500">Avg Protein</p>
                        </div>
                        <div className="bg-gray-900/50 rounded-xl p-3 text-center">
                            <p className="text-2xl font-bold text-yellow-400">{report.stats.healthScoreAvg}</p>
                            <p className="text-xs text-gray-500">Health Score</p>
                        </div>
                    </div>

                    {/* AI Summary */}
                    <div className="bg-gray-900/50 rounded-xl p-4 mb-4">
                        <p className="text-sm text-gray-300 leading-relaxed whitespace-pre-line">
                            {report.aiSummary}
                        </p>
                    </div>

                    {/* Export Button */}
                    <button className="w-full py-3 rounded-xl font-medium text-sm bg-purple-500/20 text-purple-300 border border-purple-500/30 hover:bg-purple-500/30 transition-all flex items-center justify-center gap-2">
                        <Download size={16} /> Export as PDF
                        <span className="text-xs bg-yellow-500/20 text-yellow-400 px-2 py-0.5 rounded-full ml-2">Premium</span>
                    </button>
                </>
            ) : null}
        </div>
    );
}
