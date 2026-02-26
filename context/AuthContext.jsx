'use client';
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    const fetchUser = useCallback(async () => {
        const token = localStorage.getItem('placemate_token');
        if (!token) { setLoading(false); return; }
        try {
            const res = await fetch('/api/auth/me', {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setUser(data.user);
                // Update streak on login
                fetch('/api/streak', {
                    method: 'POST',
                    headers: { Authorization: `Bearer ${token}` }
                }).catch(() => { });
            } else {
                localStorage.removeItem('placemate_token');
            }
        } catch { }
        setLoading(false);
    }, []);

    useEffect(() => { fetchUser(); }, [fetchUser]);

    const login = async (email, password) => {
        const res = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message);
        localStorage.setItem('placemate_token', data.token);
        setUser(data.user);
        return data;
    };

    const register = async (formData) => {
        const res = await fetch('/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message);
        localStorage.setItem('placemate_token', data.token);
        setUser(data.user);
        return data;
    };

    const logout = () => {
        localStorage.removeItem('placemate_token');
        setUser(null);
        router.push('/auth/login');
    };

    const updateUser = (updates) => {
        setUser(prev => prev ? { ...prev, ...updates } : prev);
    };

    const getToken = () => localStorage.getItem('placemate_token');

    const authFetch = async (url, options = {}) => {
        const token = getToken();
        return fetch(url, {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
                ...(options.headers || {}),
            },
        });
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout, updateUser, getToken, authFetch }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used within AuthProvider');
    return ctx;
}
