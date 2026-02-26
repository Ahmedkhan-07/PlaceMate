'use client';
import { Crown, Medal, Trophy } from 'lucide-react';
import Image from 'next/image';

const RankIcon = ({ rank }) => {
    if (rank === 1) return <Crown className="h-5 w-5 text-amber-400" />;
    if (rank === 2) return <Medal className="h-5 w-5 text-gray-500" />;
    if (rank === 3) return <Medal className="h-5 w-5 text-amber-600" />;
    return <span className="text-sm text-gray-400 font-mono w-5 text-center">{rank}</span>;
};

export default function LeaderboardTable({ entries = [], currentUserId }) {
    if (!entries.length) return (
        <div className="text-center py-12 text-gray-400">No data yet</div>
    );

    return (
        <div className="space-y-1.5">
            {entries.map((entry, i) => {
                const isCurrentUser = entry.userId === currentUserId;
                const rank = i + 1;
                return (
                    <div
                        key={entry.userId || i}
                        className={`flex items-center gap-4 p-4 rounded-xl border transition-all ${isCurrentUser
                                ? 'border-emerald-700/40 bg-emerald-50'
                                : rank <= 3
                                    ? 'border-amber-500/20 bg-amber-500/5'
                                    : 'border-gray-200 bg-gray-50 hover:border-gray-200'
                            }`}
                    >
                        <div className="w-6 flex justify-center shrink-0">
                            <RankIcon rank={rank} />
                        </div>
                        <div className="w-9 h-9 rounded-full bg-gray-200 overflow-hidden shrink-0 flex items-center justify-center">
                            {entry.avatar
                                ? <Image src={entry.avatar} alt={entry.name} width={36} height={36} className="object-cover w-full h-full" />
                                : <span className="text-sm font-bold text-gray-700">{entry.name?.[0]?.toUpperCase()}</span>
                            }
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className={`text-sm font-semibold truncate ${isCurrentUser ? 'text-emerald-800' : 'text-gray-800'}`}>
                                {entry.name} {isCurrentUser && <span className="text-xs text-gray-400">(you)</span>}
                            </p>
                            <p className="text-xs text-gray-400">@{entry.username}</p>
                        </div>
                        <div className="text-right shrink-0">
                            <p className="text-sm font-bold text-white">{entry.totalScore?.toLocaleString()}</p>
                            <p className="text-xs text-gray-400">pts</p>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
