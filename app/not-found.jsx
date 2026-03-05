'use client';
import Link from 'next/link';
import { GraduationCap, ArrowLeft } from 'lucide-react';

export default function NotFound() {
    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-6">
            <div className="text-center space-y-6">
                <div className="w-20 h-20 rounded-2xl bg-blue-50 border border-primary/20 flex items-center justify-center mx-auto">
                    <GraduationCap className="h-10 w-10 text-primary" />
                </div>
                <div>
                    <p className="text-8xl font-black text-slate-200 mb-2">404</p>
                    <h1 className="text-2xl font-bold text-text-primary">Page not found</h1>
                    <p className="text-text-secondary mt-2">The page you&apos;re looking for doesn&apos;t exist.</p>
                </div>
                <Link
                    href="/dashboard"
                    className="btn-primary inline-flex items-center gap-2 px-6 py-3"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to dashboard
                </Link>
            </div>
        </div>
    );
}
