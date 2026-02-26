'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useToast } from '@/context/ToastContext';

export default function ResetPasswordPage({ params }) {
    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState('');
    const [loading, setLoading] = useState(false);
    const [done, setDone] = useState(false);
    const toast = useToast();
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirm) { toast.error("Passwords don't match"); return; }
        if (password.length < 8) { toast.error('Password must be at least 8 characters'); return; }
        setLoading(true);
        try {
            const res = await fetch('/api/auth/reset-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token: params.token, password }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message);
            setDone(true);
            toast.success('Password reset successfully!');
            setTimeout(() => router.push('/auth/login'), 2000);
        } catch (err) {
            toast.error(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center" style={{ background: '#F8F9FA' }}>
            <div className="bg-white rounded-2xl shadow-card p-8 w-full max-w-md animate-fade-in">
                <div className="text-center mb-6">
                    <h1 className="text-2xl font-black text-textPrimary">Reset Password</h1>
                    <p className="text-textSecondary text-sm mt-1">Enter your new password below</p>
                </div>

                {done ? (
                    <div className="text-center py-4">
                        <div className="text-4xl mb-3">✅</div>
                        <p className="font-semibold text-textPrimary">Password reset successfully!</p>
                        <p className="text-textSecondary text-sm mt-1">Redirecting to login…</p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        <div className="input-group">
                            <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder=" " required minLength={8} />
                            <label>New Password</label>
                        </div>
                        <div className="input-group">
                            <input type="password" value={confirm} onChange={e => setConfirm(e.target.value)} placeholder=" " required />
                            <label>Confirm Password</label>
                        </div>
                        {password && confirm && password !== confirm && (
                            <p className="text-red-500 text-xs -mt-2">Passwords don't match</p>
                        )}
                        <button type="submit" disabled={loading} className="btn-primary w-full py-3 disabled:opacity-50">
                            {loading ? 'Resetting…' : 'Reset Password'}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}
