'use client';
import { CheckCircle, XCircle } from 'lucide-react';
import Button from '@/components/ui/Button';

export default function ResultPanel({ score, total, correct, incorrect, onRetry }) {
    const pct = Math.round((correct / total) * 100);
    return (
        <div className="text-center space-y-5">
            <div className={`text-5xl font-black ${pct >= 60 ? 'text-emerald-400' : 'text-rose-400'}`}>
                {pct}%
            </div>
            <p className="text-gray-700">{correct} of {total} correct</p>
            <div className="grid grid-cols-2 gap-3 max-w-xs mx-auto">
                <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3 flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-emerald-400" />
                    <span className="text-emerald-400 font-bold">{correct}</span>
                    <span className="text-xs text-gray-500">correct</span>
                </div>
                <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 flex items-center gap-2">
                    <XCircle className="h-4 w-4 text-red-400" />
                    <span className="text-red-400 font-bold">{incorrect}</span>
                    <span className="text-xs text-gray-500">wrong</span>
                </div>
            </div>
            <Button onClick={onRetry} variant="outline" size="sm">Try Again</Button>
        </div>
    );
}
