'use client';
import { Brain, Code2, BookOpen, Lock, CheckCircle, Clock } from 'lucide-react';

const ROUND_ICONS = { aptitude: Brain, coding: Code2, technical: BookOpen };
const ROUND_COLORS = {
    aptitude: 'text-emerald-700 bg-emerald-50 border-emerald-600/20',
    coding: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    technical: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
};

export default function RoundCard({ round, index, status, score, onStart }) {
    const Icon = ROUND_ICONS[round.type] || Brain;
    const colorClass = ROUND_COLORS[round.type] || ROUND_COLORS.aptitude;
    const isLocked = status === 'locked';
    const isDone = status === 'completed';
    const isActive = status === 'active';

    return (
        <div className={`
      flex items-center gap-4 p-5 border rounded-xl transition-all
      ${isDone ? 'border-emerald-500/30 bg-emerald-500/5' : isActive ? 'border-emerald-600/50 bg-emerald-50/50' : 'border-gray-200 bg-gray-50'}
      ${isLocked ? 'opacity-50' : ''}
    `}>
            <div className={`w-12 h-12 rounded-xl border flex items-center justify-center shrink-0 ${colorClass}`}>
                <Icon className="h-6 w-6" />
            </div>
            <div className="flex-1">
                <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500">Round {index + 1}</span>
                    {isDone && <CheckCircle className="h-3.5 w-3.5 text-emerald-400" />}
                </div>
                <h3 className="font-semibold text-white capitalize">{round.type} Round</h3>
                <p className="text-xs text-gray-400">{round.questions} questions · {round.duration} min</p>
                {isDone && score !== undefined && (
                    <p className="text-xs text-emerald-400 mt-0.5">Score: {score}%</p>
                )}
            </div>
            <div className="shrink-0">
                {isLocked ? (
                    <Lock className="h-5 w-5 text-gray-300" />
                ) : isDone ? (
                    <span className="text-xs text-emerald-400 font-medium">Completed</span>
                ) : (
                    <button
                        onClick={onStart}
                        className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold rounded-lg transition-colors"
                    >
                        {isActive ? 'Resume' : 'Start'}
                    </button>
                )}
            </div>
        </div>
    );
}
