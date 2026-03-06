'use client';
import { useEffect, useState, useCallback } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import StatsCard from '@/components/dashboard/StatsCard';
import ProgressChart from '@/components/dashboard/ProgressChart';
import RecentActivity from '@/components/dashboard/RecentActivity';
import StreakWidget from '@/components/dashboard/StreakWidget';
import DailyGoal from '@/components/dashboard/DailyGoal';
import QuickLinks from '@/components/dashboard/QuickLinks';
import BadgeDisplay from '@/components/dashboard/BadgeDisplay';
import BadgeAwardModal from '@/components/ui/BadgeAwardModal';
import { useAuth } from '@/context/AuthContext';
import { Brain, Code2, Target, Trophy, Sparkles } from 'lucide-react';

export default function DashboardPage() {
    const { user } = useAuth();
    const [scores, setScores] = useState([]);
    const [streak, setStreak] = useState(0);
    const [loading, setLoading] = useState(true);
    const [newBadges, setNewBadges] = useState([]);

    const load = useCallback(async () => {
        try {
            const token = localStorage.getItem('placemate_token');
            const headers = { Authorization: `Bearer ${token}` };
            const [scoresRes, streakRes] = await Promise.all([
                fetch('/api/scores', { headers }),
                fetch('/api/streak', { headers }),
            ]);
            const scoresData = await scoresRes.json();
            const streakData = await streakRes.json();
            if (scoresData.scores) setScores(scoresData.scores);
            if (streakData.streak) setStreak(streakData.streak.currentStreak || 0);

            const badgeRes = await fetch('/api/badges/check', {
                method: 'POST',
                headers: { ...headers, 'Content-Type': 'application/json' },
                body: JSON.stringify({}),
            });
            const badgeData = await badgeRes.json();
            if (badgeData.newBadges?.length > 0) setNewBadges(badgeData.newBadges);
        } catch (e) {
            console.error('Dashboard load error:', e);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        load();
        const onVisible = () => { if (document.visibilityState === 'visible') load(); };
        document.addEventListener('visibilitychange', onVisible);
        return () => document.removeEventListener('visibilitychange', onVisible);
    }, [load]);

    const aptScores = scores.filter(s => s.round === 'aptitude' || s.type === 'aptitude');
    const codingScores = scores.filter(s => s.round === 'coding' || s.type === 'coding');
    const techScores = scores.filter(s => s.round === 'technical' || s.type === 'technical');
    const mockScores = scores.filter(s => s.round === 'mock' || s.round === 'mock-drive' || s.type === 'mock');

    const avg = (arr) => arr.length ? Math.round(arr.reduce((a, s) => a + (s.percentage || 0), 0) / arr.length) : 0;
    const avgApt = avg(aptScores);
    const avgCoding = avg(codingScores);

    const chartData = Array.from({ length: 7 }, (_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - (6 - i));
        const label = d.toLocaleDateString('en', { weekday: 'short' });
        const dayScores = scores.filter(s => s.createdAt && new Date(s.createdAt).toDateString() === d.toDateString());
        return { date: label, score: dayScores.length ? Math.round(dayScores.reduce((a, s) => a + (s.percentage || 0), 0) / dayScores.length) : 0 };
    });

    const isToday = (d) => d && new Date(d).toDateString() === new Date().toDateString();

    const firstName = user?.name?.split(' ')[0] || 'Champ';
    const hour = new Date().getHours();
    const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

    return (
        <AppLayout>
            <div className="space-y-6 pb-10">

                {/* ── Hero Header ── */}
                <div className="relative rounded-2xl overflow-hidden border border-border dark:border-gray-700 bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-700 p-6 text-white">
                    {/* Decorative blobs */}
                    <div className="absolute right-0 top-0 w-64 h-full opacity-20 pointer-events-none">
                        <div className="absolute right-8 top-4 w-32 h-32 rounded-full bg-white blur-2xl" />
                        <div className="absolute right-24 bottom-2 w-20 h-20 rounded-full bg-white blur-xl" />
                    </div>
                    <div className="relative">
                        <div className="flex items-center gap-2 mb-1">
                            <Sparkles className="h-4 w-4 text-yellow-300" />
                            <span className="text-xs font-semibold text-blue-200 uppercase tracking-wide">{greeting}</span>
                        </div>
                        <h1 className="text-2xl font-black mb-1">Welcome back, {firstName}! 👋</h1>
                        <p className="text-sm text-blue-200">
                            {scores.length === 0
                                ? "Start your first session to begin tracking your progress."
                                : `You've completed ${scores.length} sessions${streak > 0 ? ` · ${streak}-day streak 🔥` : ''}. Keep pushing!`}
                        </p>
                    </div>
                </div>

                {/* ── Stats row ── */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                    <StatsCard title="Total Sessions" value={scores.length} icon={Trophy} color="amber" subtitle="All rounds combined" />
                    <StatsCard title="Aptitude Avg" value={`${avgApt}%`} icon={Brain} color="indigo" subtitle={`${aptScores.length} sessions`} />
                    <StatsCard title="Coding Avg" value={`${avgCoding}%`} icon={Code2} color="emerald" subtitle={`${codingScores.length} sessions`} />
                    <StatsCard title="Mock Drives" value={mockScores.length} icon={Target} color="sky" subtitle={mockScores.length === 1 ? '1 drive completed' : `${mockScores.length} drives completed`} />
                </div>

                {/* ── Main content ── */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    <div className="lg:col-span-2 space-y-4">
                        <ProgressChart data={chartData} title="Score Trend (Last 7 Days)" />
                        <RecentActivity activities={scores.slice(0, 6).map(s => ({
                            type: s.type || s.round,
                            title: s.topic || `${s.type || s.round} session`,
                            score: `${s.percentage || 0}%`,
                            createdAt: s.createdAt,
                        }))} />
                    </div>
                    <div className="space-y-4">
                        <StreakWidget streak={streak} />
                        <DailyGoal goals={[
                            {
                                label: 'Aptitude Questions', target: 10,
                                done: aptScores.filter(s => isToday(s.createdAt)).length,
                            },
                            {
                                label: 'Coding Problem', target: 1,
                                done: codingScores.filter(s => isToday(s.createdAt)).length,
                            },
                        ]} />
                    </div>
                </div>

                {/* ── Bottom row ── */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <QuickLinks />
                    <BadgeDisplay badges={[...new Set((user?.badges || []).map(b => b?.name || b).filter(Boolean))]} />
                </div>
            </div>

            {newBadges.length > 0 && (
                <BadgeAwardModal badges={newBadges} onClose={() => setNewBadges([])} />
            )}
        </AppLayout>
    );
}
