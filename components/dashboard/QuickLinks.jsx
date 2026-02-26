'use client';
import Link from 'next/link';
import { Brain, Code2, BookOpen, Zap, Target, Map, Building2, Trophy } from 'lucide-react';

const links = [
    { label: 'Aptitude', href: '/aptitude', icon: Brain, color: 'text-emerald-700 bg-emerald-50 hover:bg-emerald-100' },
    { label: 'Coding', href: '/coding', icon: Code2, color: 'text-emerald-700 bg-emerald-50 hover:bg-emerald-100' },
    { label: 'Technical', href: '/technical', icon: BookOpen, color: 'text-amber-700 bg-amber-50 hover:bg-amber-100' },
    { label: 'Flashcards', href: '/flashcards', icon: Zap, color: 'text-purple-700 bg-purple-50 hover:bg-purple-100' },
    { label: 'Mock Drive', href: '/mock-drive', icon: Target, color: 'text-sky-700 bg-sky-50 hover:bg-sky-100' },
    { label: 'Roadmap', href: '/roadmap', icon: Map, color: 'text-rose-700 bg-rose-50 hover:bg-rose-100' },
    { label: 'Companies', href: '/companies', icon: Building2, color: 'text-teal-700 bg-teal-50 hover:bg-teal-100' },
    { label: 'Leaderboard', href: '/leaderboard', icon: Trophy, color: 'text-orange-700 bg-orange-50 hover:bg-orange-100' },
];

export default function QuickLinks() {
    return (
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-card">
            <h3 className="text-sm font-semibold text-gray-800 mb-4">Quick Access</h3>
            <div className="grid grid-cols-4 gap-2">
                {links.map(({ label, href, icon: Icon, color }) => (
                    <Link
                        key={href}
                        href={href}
                        className={`flex flex-col items-center gap-2 p-3 rounded-xl transition-all duration-200 ${color}`}
                    >
                        <Icon className="h-5 w-5" />
                        <span className="text-xs font-medium">{label}</span>
                    </Link>
                ))}
            </div>
        </div>
    );
}
