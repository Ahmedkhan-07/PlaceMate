'use client';
import { Award } from 'lucide-react';

const BADGE_DEFS = {
    'first-login': { label: 'First Login', emoji: '🎉', color: 'text-emerald-700 bg-emerald-50 border-emerald-200' },
    'aptitude-ace': { label: 'Aptitude Ace', emoji: '🧠', color: 'text-purple-700 bg-purple-50 border-purple-200' },
    'code-ninja': { label: 'Code Ninja', emoji: '⚡', color: 'text-emerald-700 bg-emerald-50 border-emerald-200' },
    'streak-7': { label: '7-Day Streak', emoji: '🔥', color: 'text-orange-700 bg-orange-50 border-orange-200' },
    'mock-champion': { label: 'Mock Champion', emoji: '🏆', color: 'text-amber-700 bg-amber-50 border-amber-200' },
    'flashcard-pro': { label: 'Flashcard Pro', emoji: '📚', color: 'text-sky-700 bg-sky-50 border-sky-200' },
    'top-10': { label: 'Top 10', emoji: '🌟', color: 'text-yellow-700 bg-yellow-50 border-yellow-200' },
};

export default function BadgeDisplay({ badges = [] }) {
    return (
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-card">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-gray-800">My Badges</h3>
                <span className="text-xs text-gray-400">{badges.length} earned</span>
            </div>
            {badges.length === 0 ? (
                <div className="text-center py-4">
                    <Award className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                    <p className="text-xs text-gray-400">Complete challenges to earn badges</p>
                </div>
            ) : (
                <div className="flex flex-wrap gap-2">
                    {badges.map((badge, i) => {
                        const def = BADGE_DEFS[badge] || { label: badge, emoji: '🏅', color: 'text-gray-700 bg-gray-50 border-gray-200' };
                        return (
                            <div
                                key={i}
                                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-full border text-xs font-medium ${def.color}`}
                            >
                                <span>{def.emoji}</span>
                                <span>{def.label}</span>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
