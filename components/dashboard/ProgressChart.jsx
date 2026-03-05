'use client';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { useTheme } from '@/components/ThemeProvider';

const CustomTooltip = ({ active, payload, label }) => {
    const { isDark } = useTheme();
    if (active && payload && payload.length) {
        return (
            <div className={`bg-white dark:bg-gray-800 border border-border dark:border-gray-700 rounded-md px-3 py-2 shadow-card`}>
                <p className="text-text-secondary dark:text-gray-400 text-xs mb-1">{label}</p>
                {payload.map((p, i) => (
                    <p key={i} className="text-sm font-semibold" style={{ color: p.color }}>
                        {p.name}: {p.value}
                    </p>
                ))}
            </div>
        );
    }
    return null;
};

export default function ProgressChart({ data = [], title = 'Progress over time' }) {
    const { isDark } = useTheme();
    const mockData = data.length ? data : [
        { date: 'Mon', score: 0 },
        { date: 'Tue', score: 0 },
        { date: 'Wed', score: 0 },
        { date: 'Thu', score: 0 },
        { date: 'Fri', score: 0 },
        { date: 'Sat', score: 0 },
        { date: 'Sun', score: 0 },
    ];

    return (
        <div className="bg-white dark:bg-gray-800 border border-border dark:border-gray-700 rounded-xl p-5 shadow-card">
            <h3 className="text-sm font-semibold text-text-primary dark:text-gray-100 mb-4">{title}</h3>
            <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={mockData} margin={{ top: 5, right: 5, bottom: 5, left: -20 }}>
                        <defs>
                            <linearGradient id="scoreGrad" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#2563EB" stopOpacity={0.15} />
                                <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "#334155" : "#E2E8F0"} />
                        <XAxis dataKey="date" stroke="#94A3B8" tick={{ fontSize: 11 }} />
                        <YAxis stroke="#94A3B8" tick={{ fontSize: 11 }} />
                        <Tooltip content={<CustomTooltip />} />
                        <Area
                            type="monotone"
                            dataKey="score"
                            stroke="#2563EB"
                            strokeWidth={2}
                            fill="url(#scoreGrad)"
                            dot={{ fill: '#2563EB', strokeWidth: 0, r: 3 }}
                            activeDot={{ r: 5, fill: '#1D4ED8' }}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
