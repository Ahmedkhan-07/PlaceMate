'use client';
import { Brain, Code2, BookOpen, Target, Zap } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const TypeIcons = { aptitude: Brain, coding: Code2, technical: BookOpen, mock: Target, flashcard: Zap };
const TypeColors = {
    aptitude: 'text-emerald-700 bg-emerald-50',
    coding: 'text-emerald-400 bg-emerald-500/10',
    technical: 'text-amber-400 bg-amber-500/10',
    mock: 'text-sky-400 bg-sky-500/10',
    flashcard: 'text-purple-400 bg-purple-500/10',
};

export default function ActivityFeed({ activities = [] }) {
    return (
        <div className="bg-white border border-gray-200 rounded-xl p-5">
            <h3 className="text-sm font-semibold text-gray-800 mb-4">Recent Activity</h3>
            {activities.length === 0 ? (
                <p className="text-sm text-gray-400 text-center py-4">No recent activity</p>
            ) : (
                <div className="space-y-3">
                    {activities.map((act, i) => {
                        const Icon = TypeIcons[act.type] || Brain;
                        const cc = TypeColors[act.type] || TypeColors.aptitude;
                        return (
                            <div key={i} className="flex items-center gap-3">
                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${cc}`}>
                                    <Icon className="h-4 w-4" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm text-gray-800 truncate">{act.title}</p>
                                    <p className="text-xs text-gray-400">
                                        Score: {act.score} · {act.createdAt ? formatDistanceToNow(new Date(act.createdAt), { addSuffix: true }) : 'Recently'}
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
