'use client';

export default function DailyGoal({ goals = [] }) {
    const defaultGoals = [
        { label: 'Aptitude questions', target: 10, done: 0 },
        { label: 'Coding problem', target: 1, done: 0 },
        { label: 'Flashcard review', target: 10, done: 0 },
    ];

    const display = goals.length ? goals : defaultGoals;

    return (
        <div className="bg-white dark:bg-gray-800 border border-border dark:border-gray-700 rounded-xl p-5 shadow-card">
            <h3 className="text-sm font-semibold text-text-primary dark:text-gray-100 mb-4">Daily goals</h3>
            <div className="space-y-3">
                {display.map((goal, i) => {
                    const pct = Math.min((goal.done / goal.target) * 100, 100);
                    const done = pct >= 100;
                    return (
                        <div key={i}>
                            <div className="flex items-center justify-between mb-1.5">
                                <span className="text-sm text-text-primary dark:text-gray-100">{goal.label}</span>
                                <span className="text-xs text-text-secondary dark:text-gray-400">{goal.done}/{goal.target}</span>
                            </div>
                            <div className="h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                <div
                                    className={`h-full rounded-full transition-all duration-500 ${done ? 'bg-success' : 'bg-primary'}`}
                                    style={{ width: `${pct}%` }}
                                />
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
