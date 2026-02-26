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
        </div>
    );
}
