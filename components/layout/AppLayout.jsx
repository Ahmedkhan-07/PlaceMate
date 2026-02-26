'use client';
import { useState } from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import BottomBar from './BottomBar';
import { useAuth } from '@/context/AuthContext';

export default function AppLayout({ children }) {
    const [collapsed, setCollapsed] = useState(false);
    const { user } = useAuth();

    return (
        <div className="min-h-screen bg-bg">
            <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
            <Navbar collapsed={collapsed} />
            <main
                className="transition-all duration-300 pt-16 pb-16"
                style={{ marginLeft: collapsed ? '64px' : '256px' }}
            >
                <div className="p-6 min-h-[calc(100vh-128px)]">
                    {children}
                </div>
            </main>
            <BottomBar user={user} />
            {process.env.NEXT_PUBLIC_DEVELOPER_LINKEDIN && (
                <a
                    href={process.env.NEXT_PUBLIC_DEVELOPER_LINKEDIN}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="fixed bottom-2.5 right-4 z-40 text-xs text-slate-400 hover:text-primary transition-colors hidden sm:block"
                    style={{ fontSize: '11px' }}
                >
                    Connect the Developer 🔗
                </a>
            )}
        </div>
    );
}
