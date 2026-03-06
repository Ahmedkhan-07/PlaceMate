'use client';
import { Flame } from 'lucide-react';

export default function StreakWidget({ streak = 0 }) {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const short = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
    const today = new Date().getDay();

    return (
        <div className="rounded-2xl border border-border dark:border-gray-700 bg-white dark:bg-gray-800 overflow-hidden">
            <div className="h-1 bg-gradient-to-r from-orange-400 to-rose-500" />
            <div className="p-5">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-semibold text-text-primary dark:text-gray-100">Daily Streak</h3>
                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-100 dark:bg-orange-900/30 border border-orange-200 dark:border-orange-800">
                        <Flame className="h-3.5 w-3.5 text-orange-500" />
                        <span className="text-xs font-bold text-orange-600 dark:text-orange-400">{streak} {streak === 1 ? 'day' : 'days'}</span>
                    </div>
                </div>

                {/* Day circles */}
                <div className="flex gap-1 justify-between">
                    {days.map((day, i) => {
                        const isToday = i === today;
                        const isPast = i < today;
                        const isActive = isPast || isToday;
                        return (
                            <div key={i} className="flex flex-col items-center gap-1.5 flex-1">
                                <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold transition-all
                                    ${isToday ? 'bg-gradient-to-br from-orange-400 to-rose-500 text-white shadow-md' :
                                        isPast && streak > 0 ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400' :
                                            'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500'}`}>
                                    {isToday ? <Flame className="h-3.5 w-3.5" /> : short[i]}
                                </div>
                                <span className="text-xs text-text-secondary dark:text-gray-500">{short[i]}</span>
                            </div>
                        );
                    })}
                </div>

                {streak === 0 && (
                    <p className="text-xs text-text-secondary dark:text-gray-400 text-center mt-3 pt-3 border-t border-border dark:border-gray-700">
                        🎯 Complete a session to start your streak!
                    </p>
                )}
                {streak >= 7 && (
                    <p className="text-xs text-orange-500 font-semibold text-center mt-3 pt-3 border-t border-orange-100 dark:border-orange-900/30">
                        🔥 On fire! Keep it up!
                    </p>
                )}
            </div>
        </div>
    );
}
