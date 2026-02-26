'use client';
import { useEffect, useState } from 'react';
import { Timer } from 'lucide-react';

export default function TimerBar({ duration = 30, onExpire, running = true }) {
    const [timeLeft, setTimeLeft] = useState(duration);

    useEffect(() => {
        setTimeLeft(duration);
    }, [duration]);

    useEffect(() => {
        if (!running) return;
        if (timeLeft <= 0) {
            onExpire?.();
            return;
        }
        const t = setTimeout(() => setTimeLeft(t => t - 1), 1000);
        return () => clearTimeout(t);
    }, [timeLeft, running, onExpire]);

    const pct = (timeLeft / duration) * 100;
    const urgent = timeLeft <= 10;

    return (
        <div className="space-y-1.5">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-sm">
                    <Timer className={`h-4 w-4 ${urgent ? 'text-red-400 animate-pulse' : 'text-gray-500'}`} />
                    <span className={`font-mono font-semibold ${urgent ? 'text-red-400' : 'text-gray-700'}`}>
                        {timeLeft}s
                    </span>
                </div>
            </div>
            <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                <div
                    className={`h-full rounded-full transition-all duration-1000 ${urgent ? 'bg-red-500' : 'bg-emerald-700'}`}
                    style={{ width: `${pct}%` }}
                />
            </div>
        </div>
    );
}
