'use client';
import Link from 'next/link';
import { Brain, Code2, BookOpen, Zap, Target, Map, Building2, Trophy, Flame } from 'lucide-react';

const links = [
    { label: 'Aptitude', href: '/aptitude', icon: Brain, from: 'from-blue-500', to: 'to-indigo-600' },
    { label: 'Coding', href: '/coding', icon: Code2, from: 'from-violet-500', to: 'to-purple-600' },
    { label: 'Technical', href: '/technical', icon: BookOpen, from: 'from-amber-500', to: 'to-orange-600' },
    { label: 'Flashcards', href: '/flashcards', icon: Zap, from: 'from-yellow-400', to: 'to-amber-500' },
    { label: 'Mock Drive', href: '/mock-drive', icon: Target, from: 'from-sky-500', to: 'to-cyan-600' },
    { label: 'Daily', href: '/daily-challenge', icon: Flame, from: 'from-rose-500', to: 'to-pink-600' },
    { label: 'Company', href: '/company-prep', icon: Building2, from: 'from-teal-500', to: 'to-emerald-600' },
    { label: 'Leaderboard', href: '/leaderboard', icon: Trophy, from: 'from-yellow-500', to: 'to-orange-500' },
];

export default function QuickLinks() {
    return (
        <div className="rounded-2xl border border-border dark:border-gray-700 bg-white dark:bg-gray-800 overflow-hidden">
            <div className="px-5 py-4 border-b border-border dark:border-gray-700 bg-gray-50 dark:bg-gray-800/60">
                <h3 className="text-sm font-semibold text-text-primary dark:text-gray-100">Quick Access</h3>
            </div>
            <div className="p-4 grid grid-cols-4 gap-2.5">
                {links.map(({ label, href, icon: Icon, from, to }) => (
                    <Link
                        key={href}
                        href={href}
                        className="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all group"
                    >
                        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${from} ${to} flex items-center justify-center shadow-sm group-hover:shadow-md group-hover:scale-110 transition-all`}>
                            <Icon className="h-5 w-5 text-white" />
                        </div>
                        <span className="text-xs font-medium text-text-secondary dark:text-gray-400 group-hover:text-text-primary dark:group-hover:text-gray-200 text-center leading-tight transition-colors">{label}</span>
                    </Link>
                ))}
            </div>
        </div>
    );
}
