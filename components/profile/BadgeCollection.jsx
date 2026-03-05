'use client';
import { Award } from 'lucide-react';

const BADGE_DEFS = {
    'first-login': { label: 'First Login', emoji: '🎉' },
    'aptitude-ace': { label: 'Aptitude Ace', emoji: '🧠' },
    'code-ninja': { label: 'Code Ninja', emoji: '⚡' },
    'streak-7': { label: '7-Day Streak', emoji: '🔥' },
    'mock-champion': { label: 'Mock Champion', emoji: '🏆' },
    'flashcard-pro': { label: 'Flashcard Pro', emoji: '📚' },
    'top-10': { label: 'Top 10', emoji: '🌟' },
};

export default function BadgeCollection({ badges = [] }) {
    return (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5">
            <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-4">Badges ({badges.length})</h3>
            {badges.length === 0 ? (
                <div className="text-center py-6">
                    <Award className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                    <p className="text-xs text-gray-400">No badges yet</p>
                </div>
            ) : (
                <div className="grid grid-cols-3 gap-2">
                    {badges.map((badge, i) => {
                        const def = BADGE_DEFS[badge] || { label: badge, emoji: '🏅' };
                        return (
                            <div key={i} className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-gray-100 dark:bg-gray-700 border border-gray-300/30">
                                <span className="text-2xl">{def.emoji}</span>
                                <span className="text-xs text-gray-500 dark:text-gray-400 text-center leading-tight">{def.label}</span>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
