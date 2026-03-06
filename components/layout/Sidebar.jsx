'use client';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import {
    LayoutDashboard, Brain, Code2, Wrench, BookOpen,
    Target, Rocket, Map, Building2, Trophy, Award,
    Settings, LogOut, ChevronLeft, ChevronRight, Briefcase, Flame
} from 'lucide-react';

const NAV_GROUPS = [
    {
        label: 'Practice',
        items: [
            { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
            { href: '/aptitude', icon: Brain, label: 'Aptitude' },
            { href: '/coding', icon: Code2, label: 'Coding' },
            { href: '/technical', icon: Wrench, label: 'Technical' },
            { href: '/flashcards', icon: BookOpen, label: 'Flashcards' },
            { href: '/daily-challenge', icon: Flame, label: 'Daily Challenge' },
        ],
    },
    {
        label: 'Compete',
        items: [
            { href: '/mock-drive', icon: Rocket, label: 'Mock Drive' },
            { href: '/leaderboard', icon: Trophy, label: 'Leaderboard' },
            { href: '/certificates', icon: Award, label: 'Certificates' },
        ],
    },
    {
        label: 'Explore',
        items: [
            { href: '/roadmap', icon: Map, label: 'Roadmap' },
            { href: '/companies', icon: Building2, label: 'Companies' },
            { href: '/company-prep', icon: Briefcase, label: 'Company Prep' },
        ],
    },
];

export default function Sidebar({ collapsed, setCollapsed }) {
    const pathname = usePathname();
    const { user, logout } = useAuth();

    const isActive = (href) => pathname === href || pathname.startsWith(href + '/');

    return (
        <aside
            className={`fixed left-0 top-0 h-full z-40 flex flex-col transition-all duration-300 select-none ${collapsed ? 'w-16' : 'w-64'}`}
            style={{ background: 'linear-gradient(180deg, #0F172A 0%, #1E293B 100%)', boxShadow: '4px 0 30px rgba(0,0,0,0.3)' }}
        >
            {/* ── Logo ── */}
            <div className={`flex items-center ${collapsed ? 'justify-center px-2' : 'gap-3 px-4'} py-5 border-b border-white/5`}>
                <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-lg"
                    style={{ background: 'linear-gradient(135deg, #3B82F6, #8B5CF6)' }}>
                    <span className="text-white font-black text-base">P</span>
                </div>
                {!collapsed && (
                    <div className="flex-1 min-w-0">
                        <div className="text-white font-black text-base leading-none tracking-tight">PlaceMate</div>
                        <div className="text-slate-400 text-xs mt-0.5">Placement Prep</div>
                    </div>
                )}
                <button
                    onClick={() => setCollapsed(!collapsed)}
                    className={`${collapsed ? 'mt-0' : 'ml-auto'} p-1.5 rounded-lg text-slate-500 hover:text-white hover:bg-white/10 transition-all`}
                    title={collapsed ? 'Expand' : 'Collapse'}
                >
                    {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
                </button>
            </div>

            {/* ── User mini-profile ── */}
            {!collapsed && user && (
                <Link href={`/profile/${user.username}`}
                    className="mx-3 mt-3 flex items-center gap-2.5 p-3 rounded-xl border border-white/10 hover:border-blue-500/40 hover:bg-blue-500/5 transition-all group">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-bold text-sm shrink-0 overflow-hidden shadow-md"
                        style={{ background: 'linear-gradient(135deg, #3B82F6, #8B5CF6)' }}>
                        {user.profilePicture
                            ? <img src={user.profilePicture} className="w-9 h-9 rounded-xl object-cover" alt="" />
                            : user.name?.[0]?.toUpperCase()}
                    </div>
                    <div className="min-w-0 flex-1">
                        <div className="text-white text-xs font-bold truncate group-hover:text-blue-300 transition-colors">{user.name}</div>
                        <div className="text-slate-500 text-xs truncate">{user.branch || user.college || user.email?.split('@')[0]}</div>
                    </div>
                </Link>
            )}

            {/* ── Nav ── */}
            <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-1 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/10">
                {NAV_GROUPS.map((group, gi) => (
                    <div key={gi} className={gi > 0 ? 'pt-2' : ''}>
                        {/* Group label */}
                        {!collapsed && (
                            <p className="px-3 pb-1 text-[10px] font-bold uppercase tracking-widest text-slate-500">{group.label}</p>
                        )}
                        {gi > 0 && collapsed && <div className="h-px mx-2 mb-2 bg-white/5" />}

                        <div className="space-y-0.5">
                            {group.items.map(item => {
                                const Icon = item.icon;
                                const active = isActive(item.href);
                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        title={collapsed ? item.label : ''}
                                        className={`relative flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-150
                                            ${active
                                                ? 'bg-blue-500/15 text-blue-300 font-semibold'
                                                : 'text-slate-400 hover:text-slate-100 hover:bg-white/5'}
                                            ${collapsed ? 'justify-center' : ''}`}
                                    >
                                        {/* Active left bar */}
                                        {active && (
                                            <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-r-full bg-gradient-to-b from-blue-400 to-violet-500" />
                                        )}
                                        <Icon size={17} className={`shrink-0 ${active ? 'text-blue-400' : ''}`} />
                                        {!collapsed && <span className="text-sm">{item.label}</span>}
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </nav>

            {/* ── Bottom actions ── */}
            <div className="p-2 border-t border-white/5 space-y-0.5">
                <Link
                    href="/profile/settings"
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-400 hover:text-slate-100 hover:bg-white/5 transition-all ${collapsed ? 'justify-center' : ''}`}
                    title={collapsed ? 'Settings' : ''}
                >
                    <Settings size={17} className="shrink-0" />
                    {!collapsed && <span className="text-sm">Settings</span>}
                </Link>
                <button
                    onClick={logout}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all ${collapsed ? 'justify-center' : ''}`}
                    title={collapsed ? 'Logout' : ''}
                >
                    <LogOut size={17} className="shrink-0" />
                    {!collapsed && <span className="text-sm">Logout</span>}
                </button>
            </div>
        </aside>
    );
}
