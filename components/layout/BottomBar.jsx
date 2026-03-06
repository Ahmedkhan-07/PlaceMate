'use client';

const PLATFORMS = [
    {
        key: 'githubUrl',
        label: 'GitHub',
        icon: (
            <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
            </svg>
        ),
        gradient: 'from-gray-700 to-gray-900',
        ring: 'ring-gray-600/40',
    },
    {
        key: 'linkedinUrl',
        label: 'LinkedIn',
        icon: (
            <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current" xmlns="http://www.w3.org/2000/svg">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
            </svg>
        ),
        gradient: 'from-blue-600 to-blue-800',
        ring: 'ring-blue-500/40',
    },
    {
        key: 'leetcodeUrl',
        label: 'LeetCode',
        icon: <span className="text-sm font-black">LC</span>,
        gradient: 'from-orange-400 to-amber-600',
        ring: 'ring-orange-400/40',
    },
    {
        key: 'hackerrankUrl',
        label: 'HackerRank',
        icon: <span className="text-sm font-black">HR</span>,
        gradient: 'from-emerald-500 to-green-700',
        ring: 'ring-emerald-400/40',
    },
    {
        key: 'portfolioUrl',
        label: 'Portfolio',
        icon: (
            <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
            </svg>
        ),
        gradient: 'from-violet-500 to-purple-700',
        ring: 'ring-violet-400/40',
    },
    {
        key: 'twitterUrl',
        label: 'Twitter',
        icon: <span className="text-sm font-black">𝕏</span>,
        gradient: 'from-gray-800 to-black',
        ring: 'ring-gray-600/40',
    },
];

export default function BottomBar({ user }) {
    const hasAny = PLATFORMS.some(p => user?.[p.key]);

    return (
        <div
            className="fixed bottom-0 left-0 right-0 z-30 flex items-center justify-center px-4 py-2"
            style={{
                background: 'rgba(15, 23, 42, 0.85)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                borderTop: '1px solid rgba(255,255,255,0.07)',
                boxShadow: '0 -8px 32px rgba(0,0,0,0.25)',
            }}
        >
            <div className="flex items-center gap-2 flex-wrap justify-center">
                {!hasAny && (
                    <p className="text-xs text-slate-500 italic">Add your social links in profile settings</p>
                )}

                {PLATFORMS.map(({ key, label, icon, gradient, ring }) => {
                    const url = user?.[key];

                    if (!url) return (
                        <div
                            key={key}
                            title={`Add your ${label} URL in profile settings`}
                            className="group relative flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl cursor-not-allowed opacity-35"
                            style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' }}
                        >
                            <span className="text-slate-500">{icon}</span>
                            <span className="text-xs font-medium text-slate-600 hidden sm:block">{label}</span>
                            {/* Tooltip */}
                            <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 whitespace-nowrap bg-gray-900 text-white/80 text-[10px] px-2 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none border border-white/10 z-50">
                                Add {label} in settings
                            </div>
                        </div>
                    );

                    return (
                        <a
                            key={key}
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-white text-xs font-semibold
                                bg-gradient-to-r ${gradient}
                                ring-1 ${ring}
                                hover:-translate-y-0.5 hover:brightness-110 hover:shadow-lg
                                active:scale-95 transition-all duration-150`}
                        >
                            {icon}
                            <span className="hidden sm:block">{label}</span>
                        </a>
                    );
                })}
            </div>
        </div>
    );
}
