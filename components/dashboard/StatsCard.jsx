'use client';
import { TrendingUp, TrendingDown } from 'lucide-react';

export default function StatsCard({ title, value, subtitle, icon: Icon, color = 'blue', trend, trendValue }) {
    const colors = {
        blue: 'text-blue-700 bg-blue-50 border-blue-200',
        amber: 'text-amber-700 bg-amber-50 border-amber-200',
        purple: 'text-purple-700 bg-purple-50 border-purple-200',
        sky: 'text-sky-700 bg-sky-50 border-sky-200',
        rose: 'text-rose-700 bg-rose-50 border-rose-200',
        indigo: 'text-indigo-700 bg-indigo-50 border-indigo-200',
        emerald: 'text-emerald-700 bg-emerald-50 border-emerald-200',
    };

    return (
        <div className="bg-white border border-border rounded-xl p-5 shadow-card hover:shadow-card-hover transition-shadow duration-200">
            <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                    <p className="text-sm text-text-secondary mb-1">{title}</p>
                    <p className="text-2xl font-bold text-text-primary truncate">{value}</p>
                    {subtitle && <p className="text-xs text-text-secondary mt-1">{subtitle}</p>}
                    {trendValue !== undefined && (
                        <div className={`flex items-center gap-1 mt-2 text-xs font-medium ${trend === 'up' ? 'text-success' : 'text-danger'}`}>
                            {trend === 'up' ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                            <span>{trendValue}</span>
                        </div>
                    )}
                </div>
                {Icon && (
                    <div className={`w-11 h-11 rounded-xl border flex items-center justify-center shrink-0 ${colors[color] || colors.blue}`}>
                        <Icon className="h-5 w-5" />
                    </div>
                )}
            </div>
        </div>
    );
}
