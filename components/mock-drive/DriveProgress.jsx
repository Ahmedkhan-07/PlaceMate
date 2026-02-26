'use client';
import { CheckCircle, Circle, ArrowRight } from 'lucide-react';

export default function DriveProgress({ rounds = [], current = 0 }) {
    return (
        <div className="flex items-center gap-2">
            {rounds.map((round, i) => (
                <div key={i} className="flex items-center gap-2">
                    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-all
            ${i < current ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : i === current ? 'bg-emerald-600/20 text-emerald-700 border border-emerald-600/30'
                                : 'bg-gray-200 text-gray-400 border border-gray-200'}
          `}>
                        {i < current
                            ? <CheckCircle className="h-3 w-3" />
                            : <Circle className="h-3 w-3" />
                        }
                        <span className="capitalize">{round}</span>
                    </div>
                    {i < rounds.length - 1 && (
                        <ArrowRight className="h-3.5 w-3.5 text-gray-300 shrink-0" />
                    )}
                </div>
            ))}
        </div>
    );
}
