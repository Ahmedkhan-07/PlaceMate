'use client';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import {
    LayoutDashboard, Brain, Code2, Wrench, BookOpen,
    Target, Rocket, Map, Building2, Trophy, Award,
    Settings, LogOut, ChevronLeft, ChevronRight
} from 'lucide-react';

const NAV_ITEMS = [
    { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { href: '/aptitude', icon: Brain, label: 'Aptitude' },
    { href: '/coding', icon: Code2, label: 'Coding' },
    { href: '/technical', icon: Wrench, label: 'Technical' },
    { href: '/flashcards', icon: BookOpen, label: 'Flashcards' },
    { href: '/daily-challenge', icon: Target, label: 'Daily Challenge' },
    { href: '/mock-drive', icon: Rocket, label: 'Mock Drive' },
    { href: '/roadmap', icon: Map, label: 'Roadmap' },
    { href: '/companies', icon: Building2, label: 'Companies' },
    { href: '/leaderboard', icon: Trophy, label: 'Leaderboard' },
    { href: '/certificates', icon: Award, label: 'Certificates' },
];

export default function Sidebar({ collapsed, setCollapsed }) {
    const pathname = usePathname();
    const { user, logout } = useAuth();

    return (
        <aside
            className={`fixed left-0 top-0 h-full z-40 flex flex-col transition-all duration-300 ${collapsed ? 'w-16' : 'w-64'}`}
            style={{ background: '#1E3A5F', boxShadow: '4px 0 24px rgba(0,0,0,0.15)' }}
        >
            {/* Logo */}
            <div className={`flex items-center ${collapsed ? 'justify-center px-2' : 'gap-3 px-4'} py-5 border-b border-white/10`}>
                <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                    style={{ background: 'linear-gradient(135deg, #2563EB, #6366F1)' }}>
                    <span className="text-white font-bold text-lg">P</span>
                </div>
                {!collapsed && (
                    <div className="flex-1 min-w-0">
                        <div className="text-white font-bold text-lg leading-none">PlaceMate</div>
                        <div className="text-white/50 text-xs">Placement Prep</div>
                    </div>
                )}
                <button
                    onClick={() => setCollapsed(!collapsed)}
                    className="ml-auto text-white/40 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/10"
                    title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                >
                    {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
                </button>
            </div>

            {/* User mini-profile */}
            {!collapsed && user && (
                <Link href={`/profile/${user.username}`} className="mx-3 mt-3 flex items-center gap-2 p-2.5 rounded-xl hover:bg-white/10 transition-all cursor-pointer border border-white/10">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0 overflow-hidden"
                        style={{ background: 'linear-gradient(135deg, #2563EB, #6366F1)' }}>
                        {user.profilePicture
                            ? <img src={user.profilePicture} className="w-8 h-8 rounded-full object-cover" alt="" />
                            : user.name?.[0]?.toUpperCase()}
                    </div>
                    <div className="min-w-0 flex-1">
                        <div className="text-white text-xs font-semibold truncate">{user.name}</div>
                        <div className="text-white/50 text-xs truncate">{user.section ? `${user.section} • ` : ''}{user.year}</div>
                    </div>
                </Link>
            )}

            {/* Nav items */}
            <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5">
                {NAV_ITEMS.map(item => {
                    const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
                    const Icon = item.icon;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`sidebar-link flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${isActive
                                ? 'active text-white font-semibold shadow-md'
                                : 'text-white/60 hover:text-white hover:bg-sidebar-hover'
                                } ${collapsed ? 'justify-center' : ''}`}
                            title={collapsed ? item.label : ''}
                            style={isActive ? { background: 'linear-gradient(135deg, #2563EB, #6366F1)' } : {}}
                        >
                            <Icon size={18} className="shrink-0" />
                            {!collapsed && <span className="text-sm font-medium">{item.label}</span>}
                        </Link>
                    );
                })}
            </nav>

            {/* Bottom actions */}
            <div className="p-2 border-t border-white/10 space-y-0.5">
                <Link
                    href="/profile/settings"
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-white/60 hover:text-white hover:bg-white/10 transition-all ${collapsed ? 'justify-center' : ''}`}
                    title={collapsed ? 'Settings' : ''}
                >
                    <Settings size={18} className="shrink-0" />
                    {!collapsed && <span className="text-sm font-medium">Settings</span>}
                </Link>
                <button
                    onClick={logout}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-white/60 hover:text-red-400 hover:bg-red-500/10 transition-all ${collapsed ? 'justify-center' : ''}`}
                    title={collapsed ? 'Logout' : ''}
                >
                    <LogOut size={18} className="shrink-0" />
                    {!collapsed && <span className="text-sm font-medium">Logout</span>}
                </button>
            </div>
        </aside>
    );
}
