'use client';
import Link from 'next/link';
import { Brain, Code2, BookOpen, Zap, Target, Map, Building2, Trophy, Briefcase } from 'lucide-react';

const links = [
    { label: 'Aptitude', href: '/aptitude', icon: Brain, color: 'text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-100' },
    { label: 'Coding', href: '/coding', icon: Code2, color: 'text-indigo-700 bg-indigo-50 hover:bg-indigo-100' },
    { label: 'Technical', href: '/technical', icon: BookOpen, color: 'text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-900/30 hover:bg-amber-100' },
    { label: 'Flashcards', href: '/flashcards', icon: Zap, color: 'text-purple-700 bg-purple-50 hover:bg-purple-100' },
    { label: 'Mock drive', href: '/mock-drive', icon: Target, color: 'text-sky-700 bg-sky-50 hover:bg-sky-100' },
    { label: 'Roadmap', href: '/roadmap', icon: Map, color: 'text-rose-700 bg-rose-50 hover:bg-rose-100' },
    { label: 'Company prep', href: '/company-prep', icon: Briefcase, color: 'text-teal-700 bg-teal-50 hover:bg-teal-100' },
    { label: 'Leaderboard', href: '/leaderboard', icon: Trophy, color: 'text-orange-700 bg-orange-50 hover:bg-orange-100' },
];

export default function QuickLinks() {
    return (
        <div className="bg-white dark:bg-gray-800 border border-border dark:border-gray-700 rounded-xl p-5 shadow-card">
            <h3 className="text-sm font-semibold text-text-primary dark:text-gray-100 mb-4">Quick access</h3>
            <div className="grid grid-cols-4 gap-2">
                {links.map(({ label, href, icon: Icon, color }) => (
                    <Link
                        key={href}
                        href={href}
                        className={`flex flex-col items-center gap-2 p-3 rounded-xl transition-colors duration-200 ${color}`}
                    >
                        <Icon className="h-5 w-5" />
                        <span className="text-xs font-medium text-center leading-tight">{label}</span>
                    </Link>
                ))}
            </div>
        </div>
    );
}
