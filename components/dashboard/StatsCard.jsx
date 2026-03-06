'use client';
import { TrendingUp, TrendingDown } from 'lucide-react';

const colorMap = {
    blue: { bg: 'from-blue-500/10 to-blue-600/5', border: 'border-blue-500/25', icon: 'text-blue-400', bar: 'from-blue-400 to-blue-600' },
    amber: { bg: 'from-amber-500/10 to-amber-600/5', border: 'border-amber-500/25', icon: 'text-amber-400', bar: 'from-amber-400 to-orange-500' },
    indigo: { bg: 'from-indigo-500/10 to-indigo-600/5', border: 'border-indigo-500/25', icon: 'text-indigo-400', bar: 'from-indigo-400 to-purple-500' },
    emerald: { bg: 'from-emerald-500/10 to-teal-600/5', border: 'border-emerald-500/25', icon: 'text-emerald-400', bar: 'from-emerald-400 to-teal-500' },
    sky: { bg: 'from-sky-500/10 to-cyan-600/5', border: 'border-sky-500/25', icon: 'text-sky-400', bar: 'from-sky-400 to-cyan-500' },
    purple: { bg: 'from-purple-500/10 to-violet-600/5', border: 'border-purple-500/25', icon: 'text-purple-400', bar: 'from-purple-400 to-violet-500' },
    rose: { bg: 'from-rose-500/10 to-pink-600/5', border: 'border-rose-500/25', icon: 'text-rose-400', bar: 'from-rose-400 to-pink-500' },
};

export default function StatsCard({ title, value, subtitle, icon: Icon, color = 'blue', trend, trendValue }) {
    const c = colorMap[color] || colorMap.blue;

    return (
        <div className={`relative rounded-2xl border bg-gradient-to-br ${c.bg} ${c.border} p-5 overflow-hidden group hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200`}>
            {/* Glow blob */}
            <div className={`absolute -right-4 -top-4 w-20 h-20 rounded-full bg-gradient-to-br ${c.bar} opacity-10 group-hover:opacity-20 transition-opacity blur-xl`} />

            <div className="flex items-start justify-between relative">
                <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-text-secondary dark:text-gray-400 mb-1 uppercase tracking-wide">{title}</p>
                    <p className="text-3xl font-black text-text-primary dark:text-gray-100 truncate">{value}</p>
                    {subtitle && <p className="text-xs text-text-secondary dark:text-gray-400 mt-1">{subtitle}</p>}
                    {trendValue !== undefined && (
                        <div className={`flex items-center gap-1 mt-2 text-xs font-semibold ${trend === 'up' ? 'text-emerald-500' : 'text-red-400'}`}>
                            {trend === 'up' ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                            <span>{trendValue}</span>
                        </div>
                    )}
                </div>
                {Icon && (
                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${c.bar} opacity-90 flex items-center justify-center shrink-0 shadow-md`}>
                        <Icon className="h-6 w-6 text-white" />
                    </div>
                )}
            </div>
        </div>
    );
}
