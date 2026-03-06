'use client';
import { Users, Globe, Building2, BookOpen, Layers } from 'lucide-react';

const SCOPE_FILTERS = [
    { value: 'global', label: 'Global', icon: Globe, color: 'text-sky-400' },
    { value: 'college', label: 'My College', icon: Building2, color: 'text-blue-400' },
    { value: 'branch', label: 'My Branch', icon: BookOpen, color: 'text-purple-400' },
    { value: 'section', label: 'Branch & Section', icon: Layers, color: 'text-emerald-400' },
];

const SORT_OPTIONS = [
    { value: 'total', label: 'Overall Score' },
    { value: 'aptitude', label: 'Aptitude' },
    { value: 'coding', label: 'Coding' },
    { value: 'technical', label: 'Technical' },
    { value: 'streak', label: 'Streak' },
];

export default function FilterBar({ filters, onChange }) {
    const scope = filters.filter || 'global';
    const sortBy = filters.sortBy || 'total';

    return (
        <div className="space-y-4">
            {/* Scope pills */}
            <div>
                <p className="text-xs font-semibold text-text-secondary dark:text-gray-400 mb-2 uppercase tracking-wide">Scope</p>
                <div className="flex flex-wrap gap-2">
                    {SCOPE_FILTERS.map(s => {
                        const Icon = s.icon;
                        const active = scope === s.value;
                        return (
                            <button
                                key={s.value}
                                onClick={() => onChange({ ...filters, filter: s.value })}
                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all
                                    ${active
                                        ? 'bg-primary text-white border-primary shadow-sm'
                                        : 'bg-gray-100 dark:bg-gray-700 text-text-secondary dark:text-gray-300 border-border dark:border-gray-600 hover:border-primary/40'}`}
                            >
                                <Icon className={`h-3.5 w-3.5 ${active ? 'text-white' : s.color}`} />
                                {s.label}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Sort select */}
            <div>
                <p className="text-xs font-semibold text-text-secondary dark:text-gray-400 mb-2 uppercase tracking-wide">Sort by</p>
                <div className="flex flex-wrap gap-2">
                    {SORT_OPTIONS.map(o => (
                        <button
                            key={o.value}
                            onClick={() => onChange({ ...filters, sortBy: o.value })}
                            className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all
                                ${sortBy === o.value
                                    ? 'bg-primary/10 text-primary border-primary/40'
                                    : 'bg-gray-100 dark:bg-gray-700 text-text-secondary dark:text-gray-300 border-border dark:border-gray-600 hover:border-primary/30'}`}
                        >
                            {o.label}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
