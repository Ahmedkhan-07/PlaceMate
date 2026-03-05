'use client';
import { Brain, Code2, BookOpen, Target, Zap } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const activityIcons = {
    aptitude: Brain,
    coding: Code2,
    technical: BookOpen,
    flashcard: Zap,
    mock: Target,
};

const activityColors = {
    aptitude: 'text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-900/30',
    coding: 'text-indigo-700 bg-indigo-50',
    technical: 'text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-900/30',
    flashcard: 'text-purple-700 bg-purple-50',
    mock: 'text-sky-700 bg-sky-50',
};

export default function RecentActivity({ activities = [] }) {
    const empty = activities.length === 0;

    return (
        <div className="bg-white dark:bg-gray-800 border border-border dark:border-gray-700 rounded-xl p-5 shadow-card">
            <h3 className="text-sm font-semibold text-text-primary dark:text-gray-100 mb-4">Recent activity</h3>
            {empty ? (
                <div className="text-center py-8">
                    <p className="text-text-secondary dark:text-gray-400 text-sm">No activity yet. Start practicing!</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {activities.slice(0, 6).map((activity, i) => {
                        const Icon = activityIcons[activity.type] || Brain;
                        const colorClass = activityColors[activity.type] || activityColors.aptitude;
                        return (
                            <div key={i} className="flex items-center gap-3">
                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${colorClass}`}>
                                    <Icon className="h-4 w-4" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm text-text-primary dark:text-gray-100 truncate">{activity.title}</p>
                                    <p className="text-xs text-text-secondary dark:text-gray-400">
                                        Score: {activity.score} · {activity.createdAt
                                            ? formatDistanceToNow(new Date(activity.createdAt), { addSuffix: true })
                                            : 'Recently'}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
