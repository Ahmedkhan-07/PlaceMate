'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function Home() {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading) {
            router.replace(user ? '/dashboard' : '/auth/login');
        }
    }, [user, loading, router]);

    return (
        <div className="min-h-screen bg-bg flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center animate-pulse-glow"
                    style={{ background: 'linear-gradient(135deg, #2563EB, #6366F1)' }}>
                    <span className="text-white font-black text-2xl">P</span>
                </div>
                <div className="text-textSecondary text-sm">Loading PlaceMate...</div>
            </div>
        </div>
    );
}
