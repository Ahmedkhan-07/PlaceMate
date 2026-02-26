'use client';
import Link from 'next/link';

const PLATFORMS = [
    {
        key: 'githubUrl',
        label: 'GitHub',
        icon: '🐙',
        color: '#24292E',
        hoverColor: '#1a1f24',
    },
    {
        key: 'linkedinUrl',
        label: 'LinkedIn',
        icon: 'in',
        color: '#0077B5',
        hoverColor: '#005885',
        textStyle: { fontWeight: 800, fontSize: 13, fontFamily: 'serif' }
    },
    {
        key: 'leetcodeUrl',
        label: 'LeetCode',
        icon: '🟠',
        color: '#F89F1B',
        hoverColor: '#d4820c',
    },
    {
        key: 'hackerrankUrl',
        label: 'HackerRank',
        icon: '🟢',
        color: '#2EC866',
        hoverColor: '#1ea84d',
    },
    {
        key: 'portfolioUrl',
        label: 'Portfolio',
        icon: '🌐',
        color: null, // gradient
        gradient: 'linear-gradient(135deg, #2563EB, #6366F1)',
    },
    {
        key: 'twitterUrl',
        label: 'Twitter',
        icon: '𝕏',
        color: '#000000',
        hoverColor: '#1a1a1a',
        textStyle: { fontWeight: 700, fontSize: 13 }
    },
];

export default function BottomBar({ user }) {
    return (
        <div className="fixed bottom-0 left-0 right-0 z-30 flex justify-center py-2.5 px-4"
            style={{ background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(12px)', borderTop: '1px solid #E2E8F0', boxShadow: '0 -4px 24px rgba(0,0,0,0.06)' }}>
            <div className="flex items-center gap-2 flex-wrap justify-center">
                {PLATFORMS.map(({ key, label, icon, color, hoverColor, gradient, textStyle }) => {
                    const url = user?.[key];
                    if (!url) {
                        return (
                            <div
                                key={key}
                                title={`Add your ${label} URL in profile settings`}
                                className="relative group flex items-center gap-1.5 px-3 py-1.5 rounded-xl cursor-not-allowed"
                                style={{ background: '#F1F5F9', color: '#94A3B8' }}
                            >
                                <span className="text-sm">{icon}</span>
                                <span className="text-xs font-medium hidden sm:block">{label}</span>
                                <div className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 whitespace-nowrap bg-gray-900 text-white text-xs px-2 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                                    Add {label} URL in settings
                                </div>
                            </div>
                        );
                    }
                    return (
                        <a
                            key={key}
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-white font-medium text-xs transition-all hover:-translate-y-0.5 hover:shadow-md active:scale-95"
                            style={{ background: gradient || color }}
                        >
                            <span className="text-sm" style={textStyle}>{icon}</span>
                            <span className="hidden sm:block">{label}</span>
                        </a>
                    );
                })}
            </div>
        </div>
    );
}
