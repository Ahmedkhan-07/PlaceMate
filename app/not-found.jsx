'use client';
import Link from 'next/link';
import { GraduationCap, ArrowLeft } from 'lucide-react';

export default function NotFound() {
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
            <div className="text-center space-y-6">
                <div className="w-20 h-20 rounded-2xl bg-emerald-50 border border-emerald-600/20 flex items-center justify-center mx-auto">
                    <GraduationCap className="h-10 w-10 text-emerald-700" />
                </div>
                <div>
                    <p className="text-8xl font-black text-gray-200 mb-2">404</p>
                    <h1 className="text-2xl font-bold text-white">Page Not Found</h1>
                    <p className="text-gray-500 mt-2">The page you&apos;re looking for doesn&apos;t exist.</p>
                </div>
                <Link
                    href="/dashboard"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold rounded-xl transition-colors"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Dashboard
                </Link>
            </div>
        </div>
    );
}
