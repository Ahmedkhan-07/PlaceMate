'use client';
import { useState, useRef, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Search, X } from 'lucide-react';

export default function Navbar({ collapsed }) {
    const { user } = useAuth();
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
            <h1 className="font-bold text-lg text-text-primary whitespace-nowrap">{getPageTitle()}</h1>

            {/* Search bar */}
            <div className="flex-1 max-w-md relative" ref={searchRef}>
                <div className="relative">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary pointer-events-none" />
                    <input
                        type="text"
                        value={query}
                        onChange={e => handleSearch(e.target.value)}
                        onFocus={() => query && setShowDrop(true)}
                        placeholder="Search users..."
                        className="w-full pl-9 pr-8 py-2 text-sm bg-white border border-border rounded-xl focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                    />
                    {query && (
                        <button onClick={clearSearch} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text-primary">
                            <X size={14} />
                        </button>
                    )}
                </div>

                {/* Dropdown */}
                {showDrop && (
                    <div className="search-dropdown animate-fade-in">
                        {searching ? (
                            <div className="px-4 py-3 text-sm text-text-secondary">Searching...</div>
                        ) : results.length === 0 ? (
                            <div className="px-4 py-3 text-sm text-text-secondary">No users found</div>
                        ) : results.map(u => (
                            <button
                                key={u._id}
                                onClick={() => { router.push(`/profile/${u.username}`); clearSearch(); }}
                                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-background transition-colors text-left border-b border-border last:border-0"
                            >
                                <div className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0 overflow-hidden"
                                    style={{ background: 'linear-gradient(135deg, #2563EB, #6366F1)' }}>
                                    {u.profilePicture
                                        ? <img src={u.profilePicture} className="w-9 h-9 rounded-full object-cover" alt="" />
                                        : u.name?.[0]?.toUpperCase()}
                                </div>
                                <div className="min-w-0">
                                    <div className="font-semibold text-sm text-text-primary">{u.name}</div>
                                    <div className="text-xs text-text-secondary">@{u.username} • {u.college || 'No college'}</div>
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
                {user && (
                    <div className="flex items-center gap-2">
                        <div className="text-right hidden sm:block">
                            <div className="text-sm font-semibold text-text-primary leading-none">{user.name}</div>
                            <div className="text-xs text-text-secondary mt-0.5">{user.college || user.email}</div>
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
