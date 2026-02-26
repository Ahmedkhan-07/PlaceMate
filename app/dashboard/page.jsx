'use client';
import { useEffect, useState } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import StatsCard from '@/components/dashboard/StatsCard';
import ProgressChart from '@/components/dashboard/ProgressChart';
import RecentActivity from '@/components/dashboard/RecentActivity';
import StreakWidget from '@/components/dashboard/StreakWidget';
import DailyGoal from '@/components/dashboard/DailyGoal';
import QuickLinks from '@/components/dashboard/QuickLinks';
import BadgeDisplay from '@/components/dashboard/BadgeDisplay';
import ResumeCard from '@/components/dashboard/ResumeCard';
import BadgeAwardModal from '@/components/ui/BadgeAwardModal';
import { useAuth } from '@/context/AuthContext';
import { Brain, Code2, Target, Trophy } from 'lucide-react';

export default function DashboardPage() {
    const { user } = useAuth();
    const [scores, setScores] = useState([]);
    const [streak, setStreak] = useState(0);
    const [loading, setLoading] = useState(true);
    const [newBadges, setNewBadges] = useState([]);

    useEffect(() => {
        async function load() {
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

                // Check for new badge awards on load
                const badgeRes = await fetch('/api/badges/check', {
                    method: 'POST',
                    headers: { ...headers, 'Content-Type': 'application/json' },
                    body: JSON.stringify({}),
                });
                const badgeData = await badgeRes.json();
                if (badgeData.newBadges?.length > 0) {
                    setNewBadges(badgeData.newBadges);
                }
            } catch (e) {
                console.error('Dashboard load error:', e);
            } finally {
                setLoading(false);
            }
        }
        load();
    }, []);

    const aptScores = scores.filter(s => s.round === 'aptitude' || s.type === 'aptitude');
    const codingScores = scores.filter(s => s.round === 'coding' || s.type === 'coding');
    const techScores = scores.filter(s => s.round === 'technical' || s.type === 'technical');
    const mockScores = scores.filter(s => s.round === 'mock' || s.type === 'mock');

    const avg = (arr) => arr.length ? Math.round(arr.reduce((a, s) => a + (s.percentage || 0), 0) / arr.length) : 0;
    const avgApt = avg(aptScores);
    const avgCoding = avg(codingScores);

    // Chart data (last 7 days)
    const chartData = Array.from({ length: 7 }, (_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - (6 - i));
        const label = d.toLocaleDateString('en', { weekday: 'short' });
        const dayScores = scores.filter(s => {
            if (!s.createdAt) return false;
            const sd = new Date(s.createdAt);
            return sd.toDateString() === d.toDateString();
        });
        return {
            date: label,
            score: dayScores.length ? Math.round(dayScores.reduce((a, s) => a + (s.percentage || 0), 0) / dayScores.length) : 0,
        };
    });

    return (
        <AppLayout>
            <div className="space-y-6">
                {/* Header */}
                <div>
                    <h1 className="text-2xl font-bold text-text-primary">
                        Welcome back, {user?.name?.split(' ')[0] || 'Champ'}! 👋
                    </h1>
                    <p className="text-text-secondary text-sm mt-1">
                        {scores.length === 0 ? "Start your first session to see your stats." : `You've completed ${scores.length} sessions so far. Keep going!`}
                    </p>
                </div>

                {/* Stats row */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                    <StatsCard title="Total Sessions" value={scores.length} icon={Trophy} color="amber" />
                    <StatsCard title="Aptitude Avg" value={`${avgApt}%`} icon={Brain} color="indigo" />
                    <StatsCard title="Coding Avg" value={`${avgCoding}%`} icon={Code2} color="emerald" />
                    <StatsCard title="Mock Drives" value={mockScores.length} icon={Target} color="sky" />
                </div>

                {/* Main content */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    <div className="lg:col-span-2 space-y-4">
                        <ProgressChart data={chartData} title="Score Trend (Last 7 Days)" />
                        <RecentActivity activities={scores.slice(0, 6).map(s => ({
                            type: s.type || s.round,
                            title: s.title || `${s.type || s.round} session`,
                            score: `${s.percentage || 0}%`,
                            createdAt: s.createdAt
                        }))} />
                    </div>
                    <div className="space-y-4">
                        <StreakWidget streak={streak} />
                        <ResumeCard user={user} />
                        <DailyGoal goals={[
                            {
                                label: 'Aptitude Questions',
                                target: 10,
                                done: aptScores.filter(s => {
                                    const today = new Date().toDateString();
                                    return s.createdAt && new Date(s.createdAt).toDateString() === today;
                                }).length
                            },
                            {
                                label: 'Coding Problem',
                                target: 1,
                                done: codingScores.filter(s => {
                                    const today = new Date().toDateString();
                                    return s.createdAt && new Date(s.createdAt).toDateString() === today;
                                }).length
                            },
                        ]} />
                    </div>
                </div>

                {/* Quick links + badges */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <QuickLinks />
                    <BadgeDisplay badges={[...new Set((user?.badges || []).map(b => b?.name || b).filter(Boolean))]} />
                </div>
            </div>

            {/* Badge award modal */}
            {newBadges.length > 0 && (
                <BadgeAwardModal badges={newBadges} onClose={() => setNewBadges([])} />
            )}
        </AppLayout>
    );
}
