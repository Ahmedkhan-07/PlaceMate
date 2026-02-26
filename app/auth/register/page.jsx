'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';

const BRANCHES = ['CSE', 'IT', 'ECE', 'EEE', 'MECH', 'CIVIL', 'CHEM', 'MBA', 'MCA', 'Other'];
const YEARS = ['1st Year', '2nd Year', '3rd Year', '4th Year'];

export default function RegisterPage() {
    const [form, setForm] = useState({
        name: '', email: '', password: '', college: '',
        collegeCode: '', branch: '', section: '', year: ''
    });
    const [loading, setLoading] = useState(false);
    const { register } = useAuth();
    const toast = useToast();
    const router = useRouter();

    const set = (k) => (e) => {
        const val = k === 'collegeCode' ? e.target.value.toUpperCase() : e.target.value;
        setForm(f => ({ ...f, [k]: val }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (form.password.length < 8) { toast.error('Password must be at least 8 characters'); return; }
        setLoading(true);
        try {
            await register(form);
            toast.success('Account created! Welcome to PlaceMate 🎉');
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
            <div className="hidden lg:flex w-2/5 flex-col justify-center px-12"
                style={{ background: 'linear-gradient(135deg, #1E3A5F 0%, #0f2442 100%)' }}>
                <div className="w-14 h-14 rounded-2xl mb-6 flex items-center justify-center"
                    style={{ background: 'linear-gradient(135deg, #2563EB, #6366F1)' }}>
                    <span className="text-white font-black text-2xl">P</span>
                </div>
                <h2 className="text-3xl font-black text-white mb-4">Start Your<br /><span style={{ color: '#60A5FA' }}>Journey</span></h2>
                <p className="text-white/60 text-base">Join thousands of students preparing for placements with AI-powered practice.</p>
                <div className="mt-8 grid grid-cols-2 gap-3">
                    {[['🎯', 'Aptitude'], ['💻', 'Coding'], ['🔧', 'Technical'], ['📜', 'Certificates'], ['🏆', 'Leaderboard'], ['🚀', 'Mock Drive']].map(([icon, label]) => (
                        <div key={label} className="flex items-center gap-2 text-white/70 text-sm bg-white/5 rounded-xl px-3 py-2">
                            <span>{icon}</span><span>{label}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Right form */}
            <div className="flex-1 flex items-center justify-center p-8 overflow-y-auto">
                <div className="w-full max-w-lg">
                    <div className="text-center mb-8">
                        <h1 className="text-2xl font-black" style={{ color: '#1E293B' }}>Create Account</h1>
                        <p className="text-sm mt-1" style={{ color: '#64748B' }}>Fill in your details to get started</p>
                    </div>

                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        {/* Personal */}
                        <div className="input-group">
                            <input type="text" value={form.name} onChange={set('name')} placeholder=" " required />
                            <label>Full Name</label>
                        </div>
                        <div className="input-group">
                            <input type="email" value={form.email} onChange={set('email')} placeholder=" " required />
                            <label>Email Address</label>
                        </div>
                        <div className="input-group">
                            <input type="password" value={form.password} onChange={set('password')} placeholder=" " required minLength={8} />
                            <label>Password (min 8 chars)</label>
                        </div>

                        {/* Academic */}
                        <div className="input-group">
                            <input type="text" value={form.college} onChange={set('college')} placeholder=" " required />
                            <label>College / University</label>
                        </div>

                        <div className="input-group">
                            <input
                                type="text"
                                value={form.collegeCode}
                                onChange={set('collegeCode')}
                                placeholder=" "
                                style={{ textTransform: 'uppercase' }}
                            />
                            <label>College Code (e.g. JNTUH, VTU, GTU)</label>
                        </div>

                        <div className="grid grid-cols-3 gap-3">
                            <div className="input-group">
                                <select value={form.branch} onChange={set('branch')} required className={form.branch ? 'has-value' : ''}>
                                    <option value="">Branch</option>
                                    {BRANCHES.map(b => <option key={b} value={b}>{b}</option>)}
                                </select>
                                <label>Branch</label>
                            </div>
                            <div className="input-group">
                                <input type="text" value={form.section} onChange={set('section')} placeholder=" " required />
                                <label>Section</label>
                            </div>
                            <div className="input-group">
                                <select value={form.year} onChange={set('year')} required className={form.year ? 'has-value' : ''}>
                                    <option value="">Year</option>
                                    {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
                                </select>
                                <label>Year</label>
                            </div>
                        </div>

                        <button type="submit" disabled={loading} className="btn-primary w-full py-3 text-base mt-2">
                            {loading ? 'Creating account…' : 'Create Account →'}
                        </button>
                    </form>

                    <p className="text-center text-sm mt-5" style={{ color: '#64748B' }}>
                        Already have an account?{' '}
                        <Link href="/auth/login" className="font-semibold hover:underline" style={{ color: '#2563EB' }}>Sign in</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
