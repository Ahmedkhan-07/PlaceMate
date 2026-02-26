'use client';
import { CheckCircle, XCircle, RotateCcw, Share2 } from 'lucide-react';
import Button from '@/components/ui/Button';

export default function ResultSummary({ score, total, correct, incorrect, onRetry, onShare }) {
    const pct = Math.round((correct / total) * 100);
    const passed = pct >= 60;

    return (
        <div className="text-center space-y-6">
            {/* Score circle */}
            <div className="relative w-32 h-32 mx-auto">
                <svg className="w-32 h-32 -rotate-90" viewBox="0 0 120 120">
                    <circle cx="60" cy="60" r="54" stroke="#1e293b" strokeWidth="8" fill="none" />
                    <circle
                        cx="60" cy="60" r="54"
                        stroke={passed ? '#10b981' : '#f43f5e'}
                        strokeWidth="8" fill="none"
                        strokeDasharray={`${2 * Math.PI * 54}`}
                        strokeDashoffset={`${2 * Math.PI * 54 * (1 - pct / 100)}`}
                        strokeLinecap="round"
                        className="transition-all duration-1000"
                    />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className={`text-3xl font-bold ${passed ? 'text-emerald-400' : 'text-rose-400'}`}>{pct}%</span>
                    <span className="text-xs text-gray-400">Score</span>
                </div>
            </div>

            <div>
                <h3 className={`text-2xl font-bold mb-1 ${passed ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {passed ? '🎉 Great Job!' : '💪 Keep Practicing!'}
                </h3>
                <p className="text-gray-500 text-sm">You scored {score} out of {total * 10} points</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
                <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-emerald-400 shrink-0" />
                    <div>
                        <p className="text-lg font-bold text-emerald-400">{correct}</p>
                        <p className="text-xs text-gray-500">Correct</p>
                    </div>
                </div>
                <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex items-center gap-3">
                    <XCircle className="h-5 w-5 text-red-400 shrink-0" />
                    <div>
                        <p className="text-lg font-bold text-red-400">{incorrect}</p>
                        <p className="text-xs text-gray-500">Incorrect</p>
                    </div>
                </div>
            </div>

            <div className="flex gap-3">
                <Button variant="outline" onClick={onRetry} icon={RotateCcw} fullWidth>Try Again</Button>
                {onShare && <Button variant="secondary" onClick={onShare} icon={Share2} fullWidth>Share</Button>}
            </div>
        </div>
    );
}
