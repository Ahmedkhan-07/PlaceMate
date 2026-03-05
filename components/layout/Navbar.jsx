'use client';
import { useState, useRef, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/components/ThemeProvider';
import { Search, X } from 'lucide-react';

export default function Navbar({ collapsed }) {
    const { user } = useAuth();
    const { isDark, toggleTheme } = useTheme();
    const pathname = usePathname();
    const router = useRouter();
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [searching, setSearching] = useState(false);
    const [showDrop, setShowDrop] = useState(false);
    const searchRef = useRef(null);
    const debounceRef = useRef(null);

    const getPageTitle = () => {
        const map = {
            '/dashboard': 'Dashboard',
            '/aptitude': 'Aptitude Practice',
            '/coding': 'Coding Round',
            '/technical': 'Technical Round',
            '/flashcards': 'Flashcards',
            '/daily-challenge': 'Daily Challenge',
            '/mock-drive': 'Mock Placement Drive',
            '/roadmap': 'Learning Roadmap',
            '/companies': 'Company Tracker',
            '/leaderboard': 'Leaderboard',
            '/certificates': 'My Certificates',
            '/profile/settings': 'Profile Settings',
        };
        if (pathname.startsWith('/profile/') && !pathname.includes('settings')) return 'User Profile';
        return map[pathname] || 'PlaceMate';
    };

    const handleSearch = (value) => {
        setQuery(value);
        if (debounceRef.current) clearTimeout(debounceRef.current);
        if (!value.trim()) { setResults([]); setShowDrop(false); return; }
        debounceRef.current = setTimeout(async () => {
            setSearching(true);
            try {
                const token = localStorage.getItem('placemate_token');
                const res = await fetch(`/api/users/search?q=${encodeURIComponent(value)}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const data = await res.json();
                setResults(data.users || []);
                setShowDrop(true);
            } catch { setResults([]); } finally { setSearching(false); }
        }, 300);
    };

    const clearSearch = () => { setQuery(''); setResults([]); setShowDrop(false); };

    // Close on outside click
    useEffect(() => {
        const fn = (e) => { if (searchRef.current && !searchRef.current.contains(e.target)) setShowDrop(false); };
        document.addEventListener('mousedown', fn);
        return () => document.removeEventListener('mousedown', fn);
    }, []);

    return (
        <header
            className="fixed top-0 right-0 z-30 h-16 flex items-center justify-between px-6 gap-4"
            style={{
                left: collapsed ? '64px' : '256px',
                background: 'rgba(248,249,250,0.92)',
                backdropFilter: 'blur(12px)',
                borderBottom: '1px solid #E2E8F0',
                transition: 'left 0.3s ease',
            }}
        >
            <h1 className="font-bold text-lg text-text-primary dark:text-gray-100 whitespace-nowrap">{getPageTitle()}</h1>

            {/* Search bar */}
            <div className="flex-1 max-w-md relative" ref={searchRef}>
                <div className="relative">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary dark:text-gray-400 pointer-events-none" />
                    <input
                        type="text"
                        value={query}
                        onChange={e => handleSearch(e.target.value)}
                        onFocus={() => query && setShowDrop(true)}
                        placeholder="Search users..."
                        className="w-full pl-9 pr-8 py-2 text-sm text-text-primary dark:text-gray-100 bg-white dark:bg-gray-800 border border-border dark:border-gray-700 rounded-xl focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                    />
                    {query && (
                        <button onClick={clearSearch} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary dark:text-gray-400 hover:text-text-primary dark:text-gray-100 dark:hover:text-gray-100">
                            <X size={14} />
                        </button>
                    )}
                </div>

                {/* Dropdown */}
                {showDrop && (
                    <div className="search-dropdown animate-fade-in">
                        {searching ? (
                            <div className="px-4 py-3 text-sm text-text-secondary dark:text-gray-400">Searching...</div>
                        ) : results.length === 0 ? (
                            <div className="px-4 py-3 text-sm text-text-secondary dark:text-gray-400">No users found</div>
                        ) : results.map(u => (
                            <button
                                key={u._id}
                                onClick={() => { router.push(`/profile/${u.username}`); clearSearch(); }}
                                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-background dark:hover:bg-[#0F172A] dark:bg-[#0F172A] dark:hover:bg-[#0F172A] dark:bg-[#0F172A] transition-colors text-left border-b border-border dark:border-gray-700 last:border-0"
                            >
                                <div className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0 overflow-hidden"
                                    style={{ background: 'linear-gradient(135deg, #2563EB, #6366F1)' }}>
                                    {u.profilePicture
                                        ? <img src={u.profilePicture} className="w-9 h-9 rounded-full object-cover" alt="" />
                                        : u.name?.[0]?.toUpperCase()}
                                </div>
                                <div className="min-w-0">
                                    <div className="font-semibold text-sm text-text-primary dark:text-gray-100">{u.name}</div>
                                    <div className="text-xs text-text-secondary dark:text-gray-400">@{u.username} • {u.college || 'No college'}</div>
                                </div>
                                {u.globalRank > 0 && (
                                    <div className="ml-auto text-xs font-semibold text-primary">#{u.globalRank}</div>
                                )}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Right side user info */}
            <div className="flex items-center gap-3 shrink-0">
                <button
                    onClick={toggleTheme}
                    className="p-2 rounded-md border border-border dark:border-gray-700 transition-all duration-200 hover:bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-700"
                    title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
                >
                    {isDark ? (
                        <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.166 17.834a.75.75 0 00-1.06 1.06l1.59 1.591a.75.75 0 001.061-1.06l-1.59-1.591zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.166 6.166a.75.75 0 011.06-1.06l1.59 1.59a.75.75 0 01-1.06 1.061L6.166 6.166z" />
                        </svg>
                    ) : (
                        <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                            <path fillRule="evenodd" d="M9.528 1.718a.75.75 0 01.162.819A8.97 8.97 0 009 6a9 9 0 009 9 8.97 8.97 0 003.463-.69.75.75 0 01.981.98 10.503 10.503 0 01-9.694 6.46c-5.799 0-10.5-4.701-10.5-10.5 0-4.368 2.667-8.112 6.46-9.694a.75.75 0 01.818.162z" clipRule="evenodd" />
                        </svg>
                    )}
                </button>
                {user && (
                    <div className="flex items-center gap-2">
                        <div className="text-right hidden sm:block">
                            <div className="text-sm font-semibold text-text-primary dark:text-gray-100 leading-none">{user.name}</div>
                            <div className="text-xs text-text-secondary dark:text-gray-400 mt-0.5">{user.college || user.email}</div>
                        </div>
                        <button
                            onClick={() => router.push(`/profile/${user.username}`)}
                            className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0 overflow-hidden hover:ring-2 hover:ring-primary/50 transition-all"
                            style={{ background: 'linear-gradient(135deg, #2563EB, #6366F1)' }}
                        >
                            {user.profilePicture
                                ? <img src={user.profilePicture} className="w-9 h-9 rounded-full object-cover" alt="" />
                                : user.name?.[0]?.toUpperCase()}
                        </button>
                    </div>
                )}
            </div>
        </header>
    );
}
