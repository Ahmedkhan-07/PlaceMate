'use client';
import { Brain, Code2, BookOpen, Target, Zap, Activity } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const typeConfig = {
    aptitude: { icon: Brain, bg: 'bg-blue-500/10 border-blue-500/25', icon_c: 'text-blue-400', label: 'Aptitude', dot: 'bg-blue-400' },
    coding: { icon: Code2, bg: 'bg-indigo-500/10 border-indigo-500/25', icon_c: 'text-indigo-400', label: 'Coding', dot: 'bg-indigo-400' },
    technical: { icon: BookOpen, bg: 'bg-amber-500/10 border-amber-500/25', icon_c: 'text-amber-400', label: 'Technical', dot: 'bg-amber-400' },
    mock: { icon: Target, bg: 'bg-sky-500/10 border-sky-500/25', icon_c: 'text-sky-400', label: 'Mock Drive', dot: 'bg-sky-400' },
    flashcard: { icon: Zap, bg: 'bg-purple-500/10 border-purple-500/25', icon_c: 'text-purple-400', label: 'Flashcard', dot: 'bg-purple-400' },
};

function scoreColor(pct) {
    const n = parseInt(pct);
    if (n >= 80) return 'text-emerald-500';
    if (n >= 60) return 'text-amber-500';
    return 'text-red-400';
}

export default function RecentActivity({ activities = [] }) {
    const empty = activities.length === 0;

    return (
        <div className="rounded-2xl border border-border dark:border-gray-700 bg-white dark:bg-gray-800 overflow-hidden">
            <div className="px-5 py-4 border-b border-border dark:border-gray-700 bg-gray-50 dark:bg-gray-800/60 flex items-center gap-2">
                <Activity className="h-4 w-4 text-primary" />
                <h3 className="text-sm font-semibold text-text-primary dark:text-gray-100">Recent Activity</h3>
                {!empty && <span className="ml-auto text-xs text-text-secondary dark:text-gray-400">{activities.length} sessions</span>}
            </div>

            <div className="p-5">
                {empty ? (
                    <div className="text-center py-8 space-y-2">
                        <p className="text-3xl">📊</p>
                        <p className="text-sm font-medium text-text-primary dark:text-gray-100">No activity yet</p>
                        <p className="text-xs text-text-secondary dark:text-gray-400">Start practicing to see your history here</p>
                    </div>
                ) : (
                    <div className="space-y-2">
                        {activities.slice(0, 6).map((activity, i) => {
                            const cfg = typeConfig[activity.type] || typeConfig.aptitude;
                            const Icon = cfg.icon;
                            const score = parseInt(activity.score);
                            return (
                                <div key={i} className={`flex items-center gap-3 p-3 rounded-xl border transition-all hover:shadow-sm ${cfg.bg}`}>
                                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 bg-white dark:bg-gray-800 border border-border dark:border-gray-700 shadow-sm`}>
                                        <Icon className={`h-4 w-4 ${cfg.icon_c}`} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-semibold text-text-primary dark:text-gray-100 truncate">{activity.title}</p>
                                        <p className="text-xs text-text-secondary dark:text-gray-400">
                                            {activity.createdAt ? formatDistanceToNow(new Date(activity.createdAt), { addSuffix: true }) : 'Recently'}
                                        </p>
                                    </div>
                                    <div className={`text-sm font-black ${scoreColor(score)}`}>{activity.score}</div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
