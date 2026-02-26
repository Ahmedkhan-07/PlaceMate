'use client';
import { Brain, Code2, BookOpen, Target } from 'lucide-react';

export default function ProfileStats({ stats }) {
    const items = [
        { label: 'Aptitude', value: stats?.aptitudeScore ?? 0, max: 100, icon: Brain, color: 'indigo' },
        { label: 'Coding', value: stats?.codingScore ?? 0, max: 100, icon: Code2, color: 'emerald' },
        { label: 'Technical', value: stats?.technicalScore ?? 0, max: 100, icon: BookOpen, color: 'amber' },
        { label: 'Mock Drives', value: stats?.mockDrives ?? 0, max: null, icon: Target, color: 'sky' },
    ];

    const colorMap = {
        indigo: 'bg-emerald-700',
        emerald: 'bg-emerald-500',
        amber: 'bg-amber-500',
        sky: 'bg-sky-500',
    };

    return (
        <div className="bg-white border border-gray-200 rounded-xl p-5">
            <h3 className="text-sm font-semibold text-gray-800 mb-4">Performance Stats</h3>
            <div className="grid grid-cols-2 gap-4">
                {items.map(({ label, value, max, icon: Icon, color }) => (
                    <div key={label}>
                        <div className="flex items-center justify-between mb-1.5">
                            <span className="text-xs text-gray-500 flex items-center gap-1.5">
                                <Icon className={`h-3 w-3 text-${color}-400`} />
                                {label}
                            </span>
                            <span className="text-xs font-semibold text-gray-700">
                                {value}{max ? '%' : ''}
                            </span>
                        </div>
                        {max && (
                            <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                                <div
                                    className={`h-full ${colorMap[color]} rounded-full transition-all duration-700`}
                                    style={{ width: `${Math.min((value / max) * 100, 100)}%` }}
                                />
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
