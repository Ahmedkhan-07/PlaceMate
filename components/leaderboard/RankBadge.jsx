'use client';
import { Crown, Medal } from 'lucide-react';

export default function RankBadge({ rank }) {
    if (rank === 1) return (
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-400 text-sm font-bold">
            <Crown className="h-4 w-4" /> #1
        </div>
    );
    if (rank === 2) return (
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-400/20 border border-gray-500/30 text-gray-700 text-sm font-bold">
            <Medal className="h-4 w-4" /> #2
        </div>
    );
    if (rank === 3) return (
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-700/20 border border-amber-600/30 text-amber-600 text-sm font-bold">
            <Medal className="h-4 w-4" /> #3
        </div>
    );
    return (
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-200 border border-gray-300 text-gray-500 text-sm font-medium">
            #{rank}
        </div>
    );
}
