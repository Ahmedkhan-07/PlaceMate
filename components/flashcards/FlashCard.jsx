'use client';
import { useState } from 'react';
import { RotateCcw } from 'lucide-react';

export default function FlashCard({ card, index, total }) {
    const [flipped, setFlipped] = useState(false);

    return (
        <div className="perspective-1000">
            <div
                className={`relative h-64 cursor-pointer transition-transform duration-500 transform-style-3d ${flipped ? 'rotate-y-180' : ''}`}
                onClick={() => setFlipped(f => !f)}
                style={{ transformStyle: 'preserve-3d', transition: 'transform 0.6s' }}
            >
                {/* Front */}
                <div
                    className="absolute inset-0 bg-white border border-gray-200 rounded-2xl p-8 flex flex-col items-center justify-center backface-hidden"
                    style={{ backfaceVisibility: 'hidden' }}
                >
                    <div className="text-xs text-emerald-700 font-medium mb-4">Question {index + 1} of {total}</div>
                    <p className="text-lg font-medium text-white text-center leading-relaxed">{card?.front}</p>
                    <div className="absolute bottom-4 flex items-center gap-1.5 text-gray-400 text-xs">
                        <RotateCcw className="h-3 w-3" />
                        <span>Click to flip</span>
                    </div>
                </div>
                {/* Back */}
                <div
                    className="absolute inset-0 bg-emerald-800/60 border border-emerald-600/30 rounded-2xl p-8 flex flex-col items-center justify-center backface-hidden"
                    style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
                >
                    <div className="text-xs text-emerald-700 font-medium mb-4">Answer</div>
                    <p className="text-base text-emerald-100 text-center leading-relaxed">{card?.back}</p>
                </div>
            </div>
            <style jsx global>{`
        .perspective-1000 { perspective: 1000px; }
        .transform-style-3d { transform-style: preserve-3d; }
        .backface-hidden { backface-visibility: hidden; }
        .rotate-y-180 { transform: rotateY(180deg); }
      `}</style>
        </div>
    );
}
