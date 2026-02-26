'use client';
import { useEffect, useState } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import LeaderboardTable from '@/components/leaderboard/LeaderboardTable';
import FilterBar from '@/components/leaderboard/FilterBar';
import { useAuth } from '@/context/AuthContext';
import { Trophy } from 'lucide-react';

export default function LeaderboardPage() {
    const { user } = useAuth();
    const [entries, setEntries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({ timeframe: 'all', category: 'overall' });

    const load = async (f = filters) => {
        setLoading(true);
        try {
            const token = localStorage.getItem('placemate_token');
            const params = new URLSearchParams(f).toString();
            const res = await fetch(`/api/leaderboard?${params}`, { headers: { Authorization: `Bearer ${token}` } });
            const data = await res.json();
            setEntries(data.leaderboard || []);
        } catch { } finally {
            setLoading(false);
        }
    };

    useEffect(() => { load(); }, []);

    const handleFilterChange = (newFilters) => {
        setFilters(newFilters);
        load(newFilters);
    };

    return (
        <AppLayout>
            <div className="max-w-2xl mx-auto space-y-6">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center">
                        <Trophy className="h-5 w-5 text-amber-400" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-white">Leaderboard</h1>
                        <p className="text-gray-500 text-sm">Top performers ranked by score</p>
                    </div>
                </div>

                <FilterBar filters={filters} onChange={handleFilterChange} />

                {loading ? (
                    <div className="text-center py-16 text-gray-500">Loading...</div>
                ) : (
                    <LeaderboardTable entries={entries} currentUserId={user?._id} />
                )}
            </div>
        </AppLayout>
    );
}
