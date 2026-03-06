'use client';
import { useEffect, useState } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import LeaderboardTable from '@/components/leaderboard/LeaderboardTable';
import FilterBar from '@/components/leaderboard/FilterBar';
import { useAuth } from '@/context/AuthContext';
import { Trophy, Medal, Crown } from 'lucide-react';

export default function LeaderboardPage() {
    const { user } = useAuth();
    const [entries, setEntries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({ filter: 'global', sortBy: 'total' });

    const load = async (f = filters) => {
        setLoading(true);
        try {
            const token = localStorage.getItem('placemate_token');
            const params = new URLSearchParams({ filter: f.filter || 'global', sortBy: f.sortBy || 'total' }).toString();
            const res = await fetch(`/api/leaderboard?${params}`, { headers: { Authorization: `Bearer ${token}` } });
            const data = await res.json();
            setEntries(data.leaderboard || []);
        } catch { } finally {
            setLoading(false);
        }
    };

    useEffect(() => { load(); }, []);

    const handleFilterChange = (newFilters) => { setFilters(newFilters); load(newFilters); };

    const top3 = entries.slice(0, 3);
    const podiumColors = ['text-amber-400', 'text-gray-400', 'text-orange-600'];
    const podiumIcons = [Crown, Medal, Medal];

    return (
        <AppLayout>
            <div className="max-w-2xl mx-auto space-y-6 pb-10">

                {/* Header */}
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500/20 to-yellow-600/20 border border-amber-500/30 flex items-center justify-center">
                        <Trophy className="h-6 w-6 text-amber-400" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-text-primary dark:text-gray-100">Leaderboard</h1>
                        <p className="text-text-secondary dark:text-gray-400 text-sm">Top performers ranked by score</p>
                    </div>
                </div>

                {/* Top 3 Podium */}
                {!loading && top3.length >= 3 && (
                    <div className="rounded-2xl border border-border dark:border-gray-700 bg-white dark:bg-gray-800 overflow-hidden">
                        <div className="h-1.5 bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400" />
                        <div className="p-6">
                            <div className="flex items-end justify-center gap-4">
                                {[top3[1], top3[0], top3[2]].map((entry, i) => {
                                    const rank = i === 0 ? 2 : i === 1 ? 1 : 3;
                                    const heights = ['h-24', 'h-32', 'h-24'];
                                    const Icon = podiumIcons[rank - 1];
                                    const col = podiumColors[rank - 1];
                                    return (
                                        <div key={rank} className="flex flex-col items-center gap-2 flex-1">
                                            <span className="text-xs font-semibold text-text-secondary dark:text-gray-400 truncate max-w-full text-center">{entry?.username || '-'}</span>
                                            <span className="text-sm font-bold text-text-primary dark:text-gray-100">{entry?.totalScore || 0}</span>
                                            <div className={`${heights[i === 0 ? 1 : i === 1 ? 0 : 2]} w-full rounded-t-xl bg-gradient-to-b from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 border border-border dark:border-gray-600 flex flex-col items-center justify-end pb-3`}>
                                                <Icon className={`h-6 w-6 ${col}`} />
                                                <span className={`text-lg font-black ${col}`}>#{rank}</span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                )}

                {/* Filters */}
                <div className="rounded-2xl border border-border dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
                    <FilterBar filters={filters} onChange={handleFilterChange} />
                </div>

                {/* Table */}
                <div className="rounded-2xl border border-border dark:border-gray-700 bg-white dark:bg-gray-800 overflow-hidden">
                    <div className="px-6 py-4 border-b border-border dark:border-gray-700 bg-gray-50 dark:bg-gray-800/60 flex items-center gap-2">
                        <Trophy className="h-4 w-4 text-amber-400" />
                        <span className="font-semibold text-sm text-text-primary dark:text-gray-100">Rankings</span>
                        {!loading && <span className="text-xs text-text-secondary dark:text-gray-400 ml-auto">{entries.length} participants</span>}
                    </div>
                    {loading ? (
                        <div className="p-16 text-center space-y-3">
                            <div className="w-8 h-8 border-4 border-amber-400 border-t-transparent rounded-full animate-spin mx-auto" />
                            <p className="text-text-secondary dark:text-gray-400 text-sm">Loading rankings...</p>
                        </div>
                    ) : (
                        <LeaderboardTable entries={entries} currentUserId={user?._id} />
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
