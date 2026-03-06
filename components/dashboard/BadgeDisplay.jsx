'use client';
import { Award } from 'lucide-react';

const BADGE_DEFS = {
    'First Test Completed': { emoji: '🎉', color: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300' },
    'Aptitude Master': { emoji: '🧠', color: 'bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300' },
    'Technical Expert': { emoji: '💡', color: 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300' },
    'Coding Champion': { emoji: '⚡', color: 'bg-indigo-50 dark:bg-indigo-900/20 border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300' },
    'All Rounder': { emoji: '🌟', color: 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800 text-yellow-700 dark:text-yellow-300' },
    'Placement Ready': { emoji: '🚀', color: 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300' },
    'Hard Mode Champion': { emoji: '🔥', color: 'bg-rose-50 dark:bg-rose-900/20 border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300' },
    'streak-7': { emoji: '🔥', color: 'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800 text-orange-700 dark:text-orange-300' },
};

export default function BadgeDisplay({ badges = [] }) {
    return (
        <div className="rounded-2xl border border-border dark:border-gray-700 bg-white dark:bg-gray-800 overflow-hidden">
            <div className="px-5 py-4 border-b border-border dark:border-gray-700 bg-gray-50 dark:bg-gray-800/60 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Award className="h-4 w-4 text-amber-400" />
                    <h3 className="text-sm font-semibold text-text-primary dark:text-gray-100">My Badges</h3>
                </div>
                <span className="text-xs font-bold text-amber-500">{badges.length} earned</span>
            </div>
            <div className="p-5">
                {badges.length === 0 ? (
                    <div className="text-center py-6 space-y-2">
                        <div className="w-12 h-12 rounded-2xl bg-gray-100 dark:bg-gray-700 flex items-center justify-center mx-auto">
                            <Award className="h-6 w-6 text-gray-400 dark:text-gray-500" />
                        </div>
                        <p className="text-xs font-medium text-text-secondary dark:text-gray-400">Complete challenges to earn badges</p>
                    </div>
                ) : (
                    <div className="flex flex-wrap gap-2">
                        {badges.map((badge, i) => {
                            const def = BADGE_DEFS[badge] || { emoji: '🏅', color: 'bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300' };
                            return (
                                <div key={i} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-semibold ${def.color} hover:scale-105 transition-transform cursor-default`}>
                                    <span>{def.emoji}</span>
                                    <span>{badge}</span>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
