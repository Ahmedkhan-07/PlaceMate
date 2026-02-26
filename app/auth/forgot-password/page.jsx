'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useToast } from '@/context/ToastContext';

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);
    const toast = useToast();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch('/api/auth/forgot-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });
            const data = await res.json();
            setSent(true);
            toast.success(data.message);
        } catch {
            toast.error('Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center" style={{ background: '#F8F9FA' }}>
            <div className="bg-white rounded-2xl shadow-card p-8 w-full max-w-md animate-fade-in">
                <div className="text-center mb-6">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4"
                        style={{ background: 'linear-gradient(135deg, #2563EB, #6366F1)' }}>
                        <span className="text-white font-black text-xl">P</span>
                    </div>
                    <h1 className="text-2xl font-black text-textPrimary">Forgot Password</h1>
                    <p className="text-textSecondary text-sm mt-1">Enter your email to receive a reset link</p>
                </div>

                {sent ? (
                    <div className="text-center py-4">
                        <div className="text-4xl mb-3">📧</div>
                        <p className="text-textPrimary font-semibold">Check your email</p>
                        <p className="text-textSecondary text-sm mt-1">If this email is registered, you'll receive a reset link shortly.</p>
                        <Link href="/auth/login" className="btn-primary inline-block mt-6 px-8 py-3">Back to Login</Link>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        <div className="input-group">
                            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder=" " required />
                            <label>Email Address</label>
                        </div>
                        <button type="submit" disabled={loading} className="btn-primary w-full py-3 disabled:opacity-50">
                            {loading ? 'Sending…' : 'Send Reset Link'}
                        </button>
                        <Link href="/auth/login" className="text-center text-sm text-textSecondary hover:text-primary transition-colors">
                            ← Back to Login
                        </Link>
                    </form>
                )}
            </div>
        </div>
    );
}
