'use client';
import { useEffect, useState } from 'react';
import { X, Award } from 'lucide-react';

const BADGE_META = {
    'First Step': { emoji: '👣', color: '#6366F1', gradient: 'linear-gradient(135deg, #6366F1, #8B5CF6)', desc: 'Completed your first test!' },
    'Aptitude Starter': { emoji: '🧮', color: '#2563EB', gradient: 'linear-gradient(135deg, #2563EB, #60A5FA)', desc: 'Completed first aptitude test!' },
    'Code Newbie': { emoji: '💻', color: '#0EA5E9', gradient: 'linear-gradient(135deg, #0EA5E9, #38BDF8)', desc: 'Solved your first coding problem!' },
    'Tech Explorer': { emoji: '🔧', color: '#8B5CF6', gradient: 'linear-gradient(135deg, #8B5CF6, #A78BFA)', desc: 'Completed first technical round!' },
    '7 Day Warrior': { emoji: '🔥', color: '#F59E0B', gradient: 'linear-gradient(135deg, #F59E0B, #FCD34D)', desc: 'Maintained a 7-day streak!' },
    '30 Day Legend': { emoji: '⚡', color: '#F59E0B', gradient: 'linear-gradient(135deg, #EF4444, #F59E0B)', desc: 'Incredible 30-day streak!' },
    'Aptitude Master': { emoji: '🎯', color: '#16A34A', gradient: 'linear-gradient(135deg, #16A34A, #4ADE80)', desc: 'Scored 90%+ in aptitude!' },
    'Coding Champion': { emoji: '🏆', color: '#DC2626', gradient: 'linear-gradient(135deg, #DC2626, #F87171)', desc: 'Solved 50 coding problems!' },
    'Technical Expert': { emoji: '🔬', color: '#7C3AED', gradient: 'linear-gradient(135deg, #7C3AED, #C084FC)', desc: 'Completed all technical topics!' },
    'Speed Demon': { emoji: '⚡', color: '#EF4444', gradient: 'linear-gradient(135deg, #EF4444, #FB923C)', desc: 'Finished a test in half the time!' },
    'Placement Ready': { emoji: '🚀', color: '#2563EB', gradient: 'linear-gradient(135deg, #1E3A5F, #2563EB)', desc: 'Completed a full mock drive!' },
    'Hard Mode Champion': { emoji: '💪', color: '#B45309', gradient: 'linear-gradient(135deg, #B45309, #F59E0B)', desc: 'Conquered the Hard mock drive!' },
    'All Rounder': { emoji: '🌟', color: '#F59E0B', gradient: 'linear-gradient(135deg, #6366F1, #F59E0B)', desc: 'Scored 80%+ in all 3 rounds!' },
    'Perfect Score': { emoji: '💯', color: '#16A34A', gradient: 'linear-gradient(135deg, #16A34A, #2563EB)', desc: 'Got 100% in a round — perfect!' },
};

function ConfettiPiece({ delay, color }) {
    const left = Math.random() * 100;
    const animDuration = 1.5 + Math.random();
    return (
        <div
            className="confetti-particle"
            style={{
                left: `${left}%`,
                background: color,
                animationDelay: `${delay}s`,
                animationDuration: `${animDuration}s`,
                width: 8 + Math.random() * 6,
                height: 8 + Math.random() * 6,
                borderRadius: Math.random() > 0.5 ? '50%' : '2px',
            }}
        />
    );
}

export default function BadgeAwardModal({ badges, onClose }) {
    const [visible, setVisible] = useState(false);
    const [current, setCurrent] = useState(0);

    useEffect(() => {
        if (badges?.length > 0) {
            setVisible(true);
            setCurrent(0);
        }
    }, [badges]);

    if (!visible || !badges?.length) return null;

    const badge = badges[current];
    const meta = BADGE_META[badge] || { emoji: '🏅', color: '#2563EB', gradient: 'linear-gradient(135deg, #2563EB, #6366F1)', desc: 'New badge earned!' };

    const confettiColors = ['#2563EB', '#6366F1', '#F59E0B', '#16A34A', '#EF4444', '#8B5CF6'];

    const handleNext = () => {
        if (current < badges.length - 1) {
            setCurrent(c => c + 1);
        } else {
            setVisible(false);
            onClose?.();
        }
    };

    return (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in">
            {/* Confetti */}
            {Array.from({ length: 25 }).map((_, i) => (
                <ConfettiPiece key={i} delay={i * 0.06} color={confettiColors[i % confettiColors.length]} />
            ))}

            <div className="relative bg-white rounded-3xl p-8 max-w-sm w-full mx-4 text-center shadow-2xl animate-scale-in">
                {/* Close */}
                <button onClick={() => { setVisible(false); onClose?.(); }}
                    className="absolute top-4 right-4 text-text-secondary hover:text-text-primary transition-colors">
                    <X size={18} />
                </button>

                {/* Badge counter */}
                {badges.length > 1 && (
                    <div className="absolute top-4 left-4 text-xs text-text-secondary">
                        {current + 1} / {badges.length}
                    </div>
                )}

                {/* Badge icon with glow */}
                <div className="mx-auto w-24 h-24 rounded-full flex items-center justify-center mb-4 shadow-xl badge-glow"
                    style={{ background: meta.gradient }}>
                    <span className="text-5xl">{meta.emoji}</span>
                </div>

                <div className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: meta.color }}>
                    Badge Unlocked! 🎉
                </div>

                <h2 className="text-2xl font-black text-text-primary mb-2">{badge}</h2>
                <p className="text-text-secondary text-sm mb-6">{meta.desc}</p>

                {/* Progress dots */}
                {badges.length > 1 && (
                    <div className="flex justify-center gap-1.5 mb-4">
                        {badges.map((_, i) => (
                            <div key={i} className="w-2 h-2 rounded-full transition-all"
                                style={{ background: i === current ? meta.color : '#E2E8F0' }} />
                        ))}
                    </div>
                )}

                <button
                    onClick={handleNext}
                    className="btn-primary w-full py-3"
                    style={{ background: meta.gradient }}
                >
                    {current < badges.length - 1 ? 'Next Badge →' : 'Awesome! 🎉'}
                </button>
            </div>
        </div>
    );
}
