'use client';
import { Award } from 'lucide-react';

const BADGE_DEFS = {
    'first-login': { label: 'First login', emoji: '🎉', color: 'text-blue-700 bg-blue-50 border-blue-200' },
    'aptitude-ace': { label: 'Aptitude ace', emoji: '🧠', color: 'text-purple-700 bg-purple-50 border-purple-200' },
    'code-ninja': { label: 'Code ninja', emoji: '⚡', color: 'text-indigo-700 bg-indigo-50 border-indigo-200' },
    'streak-7': { label: '7-day streak', emoji: '🔥', color: 'text-orange-700 bg-orange-50 border-orange-200' },
    'mock-champion': { label: 'Mock champion', emoji: '🏆', color: 'text-amber-700 bg-amber-50 border-amber-200' },
    'flashcard-pro': { label: 'Flashcard pro', emoji: '📚', color: 'text-sky-700 bg-sky-50 border-sky-200' },
    'top-10': { label: 'Top 10', emoji: '🌟', color: 'text-yellow-700 bg-yellow-50 border-yellow-200' },
};

export default function BadgeDisplay({ badges = [] }) {
    return (
        <div className="bg-white border border-border rounded-xl p-5 shadow-card">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-text-primary">My badges</h3>
                <span className="text-xs text-text-secondary">{badges.length} earned</span>
            </div>
            {badges.length === 0 ? (
                <div className="text-center py-4">
                    <Award className="h-8 w-8 text-slate-300 mx-auto mb-2" />
                    <p className="text-xs text-text-secondary">Complete challenges to earn badges</p>
                </div>
            ) : (
                <div className="flex flex-wrap gap-2">
                    {badges.map((badge, i) => {
                        const def = BADGE_DEFS[badge] || { label: badge, emoji: '🏅', color: 'text-slate-700 bg-slate-50 border-slate-200' };
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
