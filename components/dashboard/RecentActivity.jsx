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
    aptitude: 'text-emerald-700 bg-emerald-50',
    coding: 'text-emerald-700 bg-emerald-50',
    technical: 'text-amber-700 bg-amber-50',
    flashcard: 'text-purple-700 bg-purple-50',
    mock: 'text-sky-700 bg-sky-50',
};

export default function RecentActivity({ activities = [] }) {
    const empty = activities.length === 0;

    return (
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-card">
            <h3 className="text-sm font-semibold text-gray-800 mb-4">Recent Activity</h3>
            {empty ? (
                <div className="text-center py-8">
                    <p className="text-gray-400 text-sm">No activity yet. Start practicing!</p>
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
                                    <p className="text-sm text-gray-800 truncate">{activity.title}</p>
                                    <p className="text-xs text-gray-400">
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
