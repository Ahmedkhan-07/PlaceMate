'use client';
import { CheckCircle2 } from 'lucide-react';

const goalColors = [
    { bar: 'from-blue-400 to-indigo-500', bg: 'bg-blue-50 dark:bg-blue-900/20', border: 'border-blue-200 dark:border-blue-800' },
    { bar: 'from-purple-400 to-violet-500', bg: 'bg-purple-50 dark:bg-purple-900/20', border: 'border-purple-200 dark:border-purple-800' },
    { bar: 'from-emerald-400 to-teal-500', bg: 'bg-emerald-50 dark:bg-emerald-900/20', border: 'border-emerald-200 dark:border-emerald-800' },
];

export default function DailyGoal({ goals = [] }) {
    const defaultGoals = [
        { label: 'Aptitude questions', target: 10, done: 0 },
        { label: 'Coding problem', target: 1, done: 0 },
    ];
    const display = goals.length ? goals : defaultGoals;
    const allDone = display.every(g => g.done >= g.target);

    return (
        <div className="rounded-2xl border border-border dark:border-gray-700 bg-white dark:bg-gray-800 overflow-hidden">
            <div className="h-1 bg-gradient-to-r from-emerald-400 to-teal-500" />
            <div className="p-5">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-semibold text-text-primary dark:text-gray-100">Today&apos;s Goals</h3>
                    {allDone && <span className="text-xs text-emerald-500 font-bold flex items-center gap-1"><CheckCircle2 className="h-3.5 w-3.5" />All done!</span>}
                </div>

                <div className="space-y-4">
                    {display.map((goal, i) => {
                        const pct = Math.min((goal.done / goal.target) * 100, 100);
                        const done = pct >= 100;
                        const c = goalColors[i % goalColors.length];
                        return (
                            <div key={i} className={`p-3 rounded-xl border ${c.bg} ${c.border}`}>
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-xs font-semibold text-text-primary dark:text-gray-100">{goal.label}</span>
                                    <span className="text-xs font-bold text-text-secondary dark:text-gray-400">{goal.done}/{goal.target}</span>
                                </div>
                                <div className="h-2 bg-white/60 dark:bg-gray-700/60 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full rounded-full bg-gradient-to-r ${done ? 'from-emerald-400 to-teal-500' : c.bar} transition-all duration-700`}
                                        style={{ width: `${pct}%` }}
                                    />
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
