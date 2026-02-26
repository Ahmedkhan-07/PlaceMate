'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';

function FloatInput({ label, type = 'text', value, onChange, required }) {
    return (
        <div className="input-group">
            <input type={type} value={value} onChange={onChange} placeholder=" " required={required}
                className="w-full px-4 pt-5 pb-2 border border-border rounded-xl text-sm outline-none focus:border-primary transition-all bg-white text-textPrimary" />
            <label className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-textSecondary pointer-events-none transition-all peer-focus:top-2 peer-focus:text-xs">{label}</label>
        </div>
    );
}

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const toast = useToast();
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await login(email, password);
            toast.success('Welcome back!');
            router.push('/dashboard');
        } catch (err) {
            toast.error(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex" style={{ background: '#F8F9FA' }}>
            {/* Left panel */}
            <div className="hidden lg:flex w-1/2 flex-col justify-center px-16"
                style={{ background: 'linear-gradient(135deg, #1E3A5F 0%, #0f2442 100%)' }}>
                <div className="w-14 h-14 rounded-2xl mb-6 flex items-center justify-center"
                    style={{ background: 'linear-gradient(135deg, #2563EB, #6366F1)' }}>
                    <span className="text-white font-black text-2xl">P</span>
                </div>
                <h2 className="text-4xl font-black text-white mb-4 leading-tight">
                    Ace Your<br /><span style={{ background: 'linear-gradient(135deg, #60A5FA, #A78BFA)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Placement</span>
                </h2>
                <p className="text-white/60 text-lg max-w-xs">
                    AI-powered mock drives, aptitude training, and certificate generation. Get placement-ready.
                </p>
                <div className="mt-10 flex flex-col gap-4">
                    {['🎯 AI-generated practice questions', '💻 Real code execution', '📜 Verified certificates', '🏆 Section leaderboard'].map(f => (
                        <div key={f} className="flex items-center gap-3 text-white/70 text-sm">{f}</div>
                    ))}
                </div>
            </div>

            {/* Right form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
                <div className="w-full max-w-md">
                    <div className="text-center mb-8">
                        <div className="inline-flex w-12 h-12 rounded-xl items-center justify-center mb-4 lg:hidden"
                            style={{ background: 'linear-gradient(135deg, #2563EB, #6366F1)' }}>
                            <span className="text-white font-black text-xl">P</span>
                        </div>
                        <h1 className="text-2xl font-black text-textPrimary">Welcome back</h1>
                        <p className="text-textSecondary text-sm mt-1">Sign in to continue your prep</p>
                    </div>

                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        <div className="input-group">
                            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder=" " required />
                            <label>Email address</label>
                        </div>
                        <div className="input-group">
                            <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder=" " required />
                            <label>Password</label>
                        </div>

                        <div className="flex justify-end">
                            <Link href="/auth/forgot-password" className="text-xs text-primary hover:underline">Forgot password?</Link>
                        </div>

                        <button type="submit" disabled={loading}
                            className="btn-primary w-full py-3 text-base disabled:opacity-50 disabled:cursor-not-allowed">
                            {loading ? 'Signing in…' : 'Sign In'}
                        </button>
                    </form>

                    <p className="text-center text-sm text-textSecondary mt-6">
                        New to PlaceMate?{' '}
                        <Link href="/auth/register" className="text-primary font-semibold hover:underline">Create account</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
