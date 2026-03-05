'use client';
import { Flame } from 'lucide-react';

export default function StreakWidget({ streak = 0 }) {
    const days = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
    const today = new Date().getDay();

    return (
        <div className="bg-white border border-border rounded-xl p-5 shadow-card">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-text-primary">Daily streak</h3>
                <div className="flex items-center gap-1.5">
                    <Flame className="h-4 w-4 text-orange-500" />
                    <span className="text-sm font-bold text-orange-500">{streak} days</span>
                </div>
            </div>

            <div className="flex gap-1.5 justify-between">
                {days.map((day, i) => (
                    <div key={i} className="flex flex-col items-center gap-1.5">
                        <div className={`
              w-8 h-8 rounded-lg flex items-center justify-center text-xs font-medium transition-all
              ${i === today
                                ? 'bg-orange-500 text-white'
                                : i < today
                                    ? 'bg-orange-100 text-orange-600'
                                    : 'bg-slate-100 text-slate-400'}`}>
                            {i === today ? <Flame className="h-4 w-4" /> : day}
                        </div>
                        <span className="text-xs text-text-secondary">{day}</span>
                    </div>
                ))}
            </div>

            {streak === 0 && (
                <p className="text-xs text-text-secondary text-center mt-3">
                    Complete a session today to start your streak!
                </p>
            )}
        </div>
    );
}
