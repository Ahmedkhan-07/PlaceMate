'use client';
import Link from 'next/link';
import { GraduationCap } from 'lucide-react';

export default function AuthLayout({ children, title, subtitle }) {
    return (
        <div className="min-h-screen bg-emerald-950 flex flex-col">
            {/* Background */}
            <div className="fixed inset-0 bg-gradient-to-br from-emerald-950 via-emerald-950 to-green-950/30 pointer-events-none" />
            <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,rgba(46,125,50,0.08),transparent_60%)] pointer-events-none" />

            {/* Header */}
            <header className="relative z-10 flex items-center justify-between px-6 py-5 max-w-7xl mx-auto w-full">
                <Link href="/" className="flex items-center gap-2.5">
                    <div className="w-9 h-9 bg-emerald-700 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/30">
                        <GraduationCap className="h-5 w-5 text-white" />
                    </div>
                    <span className="text-xl font-bold text-white">PlaceMate</span>
                </Link>
            </header>

            {/* Main */}
            <main className="relative z-10 flex-1 flex items-center justify-center px-4 py-8">
                <div className="w-full max-w-md">
                    {(title || subtitle) && (
                        <div className="text-center mb-8">
                            {title && <h1 className="text-3xl font-bold text-white mb-2">{title}</h1>}
                            {subtitle && <p className="text-emerald-300/70">{subtitle}</p>}
                        </div>
                    )}
                    <div className="bg-emerald-900/60 backdrop-blur-xl border border-emerald-700/50 rounded-2xl p-8 shadow-2xl shadow-black/30">
                        {children}
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="relative z-10 py-4 text-center text-xs text-emerald-600">
                © {new Date().getFullYear()} PlaceMate. All rights reserved.
            </footer>
        </div>
    );
}
