'use client';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white border border-gray-200 rounded-lg px-3 py-2 shadow-xl">
                <p className="text-gray-500 text-xs mb-1">{label}</p>
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

export default function ProgressChart({ data = [], title = 'Progress Over Time' }) {
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
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-card">
            <h3 className="text-sm font-semibold text-gray-800 mb-4">{title}</h3>
            <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={mockData} margin={{ top: 5, right: 5, bottom: 5, left: -20 }}>
                        <defs>
                            <linearGradient id="scoreGrad" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#2E7D32" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#2E7D32" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                        <XAxis dataKey="date" stroke="#9CA3AF" tick={{ fontSize: 11 }} />
                        <YAxis stroke="#9CA3AF" tick={{ fontSize: 11 }} />
                        <Tooltip content={<CustomTooltip />} />
                        <Area
                            type="monotone"
                            dataKey="score"
                            stroke="#2E7D32"
                            strokeWidth={2}
                            fill="url(#scoreGrad)"
                            dot={{ fill: '#2E7D32', strokeWidth: 0, r: 3 }}
                            activeDot={{ r: 5, fill: '#1B5E20' }}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
