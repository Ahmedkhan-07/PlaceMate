'use client';

export default function DailyGoal({ goals = [] }) {
    const defaultGoals = [
        { label: 'Aptitude Questions', target: 10, done: 0 },
        { label: 'Coding Problem', target: 1, done: 0 },
        { label: 'Flashcard Review', target: 10, done: 0 },
    ];

    const display = goals.length ? goals : defaultGoals;

    return (
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-card">
            <h3 className="text-sm font-semibold text-gray-800 mb-4">Daily Goals</h3>
            <div className="space-y-3">
                {display.map((goal, i) => {
                    const pct = Math.min((goal.done / goal.target) * 100, 100);
                    return (
                        <div key={i}>
                            <div className="flex items-center justify-between mb-1.5">
                                <span className="text-sm text-gray-700">{goal.label}</span>
                                <span className="text-xs text-gray-400">{goal.done}/{goal.target}</span>
                            </div>
                            <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-emerald-600 rounded-full transition-all duration-500"
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
