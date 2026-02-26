'use client';
import { useEffect, useState, useRef } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { Camera, Save, User, GraduationCap, Link2, Trophy, Loader2 } from 'lucide-react';

const BRANCHES = ['CSE', 'IT', 'ECE', 'EEE', 'MECH', 'CIVIL', 'CHEM', 'MBA', 'MCA', 'Other'];
const YEARS = ['1st Year', '2nd Year', '3rd Year', '4th Year'];
const SECTIONS = ['A', 'B', 'C', 'D', 'E', 'F'];

function SectionCard({ icon: Icon, title, children }) {
    return (
        <div className="bg-white rounded-2xl border border-border shadow-sm p-6">
            <div className="flex items-center gap-2 mb-5 pb-3 border-b border-border">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #2563EB22, #6366F122)' }}>
                    <Icon size={16} style={{ color: '#2563EB' }} />
                </div>
                <h2 className="font-semibold text-text-primary">{title}</h2>
            </div>
            {children}
        </div>
    );
}

function FloatInput({ label, value, onChange, type = 'text', readOnly = false, placeholder, style }) {
    return (
        <div className="input-group">
            <input
                type={type}
                value={value || ''}
                onChange={onChange}
                placeholder=" "
                readOnly={readOnly}
                style={{ ...style, background: readOnly ? '#F8F9FA' : 'white', cursor: readOnly ? 'not-allowed' : 'text' }}
            />
            <label>{label}</label>
            {placeholder && !value && <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-text-secondary pointer-events-none opacity-60">{placeholder}</div>}
        </div>
    );
}

function FloatSelect({ label, value, onChange, options, disabled }) {
    return (
        <div className="input-group">
            <select value={value || ''} onChange={onChange} disabled={disabled}
                className={value ? 'has-value' : ''}
                style={{ background: disabled ? '#F8F9FA' : 'white', cursor: disabled ? 'not-allowed' : 'pointer' }}>
                <option value=""></option>
                {options.map(o => <option key={o} value={o}>{o}</option>)}
            </select>
            <label>{label}</label>
        </div>
    );
}

function RankBadge({ label, value, icon }) {
    return (
        <div className="flex flex-col items-center gap-1 p-4 rounded-2xl border border-border bg-gradient-to-b from-white to-background">
            <div className="text-2xl">{icon}</div>
            <div className="text-xs font-semibold" style={{ color: '#64748B' }}>{label}</div>
            <div className="text-xl font-black" style={{ color: value > 0 ? '#2563EB' : '#94A3B8' }}>
                {value > 0 ? `#${value}` : '—'}
            </div>
        </div>
    );
}

export default function ProfileSettingsPage() {
    const { user, setUser } = useAuth();
    const toast = useToast();
    const fileRef = useRef();
    const [form, setForm] = useState({
        name: '', bio: '', year: '', rollNumber: '', leetcodeRank: '',
        college: '', collegeCode: '', branch: '', section: '',
        linkedinUrl: '', githubUrl: '', leetcodeUrl: '',
        hackerrankUrl: '', portfolioUrl: '', twitterUrl: '',
        profilePicture: '',
    });
    const [preview, setPreview] = useState('');
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        if (user) {
            setForm({
                name: user.name || '',
                bio: user.bio || '',
                year: user.year || '',
                rollNumber: user.rollNumber || '',
                leetcodeRank: user.leetcodeRank || '',
                college: user.college || '',
                collegeCode: user.collegeCode || '',
                branch: user.branch || '',
                section: user.section || '',
                linkedinUrl: user.linkedinUrl || '',
                githubUrl: user.githubUrl || '',
                leetcodeUrl: user.leetcodeUrl || '',
                hackerrankUrl: user.hackerrankUrl || '',
                portfolioUrl: user.portfolioUrl || '',
                twitterUrl: user.twitterUrl || '',
                profilePicture: user.profilePicture || '',
            });
            setPreview(user.profilePicture || '');
        }
    }, [user]);

    const set = (field) => (e) => {
        const val = field === 'collegeCode' ? e.target.value.toUpperCase() : e.target.value;
        setForm(f => ({ ...f, [field]: val }));
    };

    const handleImageSelect = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (ev) => setPreview(ev.target.result);
        reader.readAsDataURL(file);
    };

    const uploadImage = async () => {
        const file = fileRef.current?.files?.[0];
        if (!file) return form.profilePicture;
        setUploading(true);
        try {
            const token = localStorage.getItem('placemate_token');
            const fd = new FormData();
            fd.append('file', file);
            const res = await fetch('/api/resume/upload', { method: 'POST', headers: { Authorization: `Bearer ${token}` }, body: fd });
            const data = await res.json();
            return data.url || form.profilePicture;
        } catch {
            return form.profilePicture;
        } finally {
            setUploading(false);
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            let pictureUrl = form.profilePicture;
            if (fileRef.current?.files?.[0]) {
                pictureUrl = await uploadImage();
            }

            const token = localStorage.getItem('placemate_token');
            const res = await fetch('/api/profile', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify({ ...form, profilePicture: pictureUrl }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || 'Failed to save');
            setUser?.(data.user);
            toast.success('Profile updated! ✅');
        } catch (ex) {
            toast.error(ex.message || 'Failed to save');
        } finally {
            setSaving(false);
        }
    };

    return (
        <AppLayout>
            <div className="max-w-2xl mx-auto space-y-6 pb-24">
                <div>
                    <h1 className="text-2xl font-bold text-text-primary">Profile Settings</h1>
                    <p className="text-text-secondary text-sm mt-1">Update your public profile information</p>
                </div>

                <form onSubmit={handleSave} className="space-y-5">
                    {/* Section 1: Personal Info */}
                    <SectionCard icon={User} title="Personal Info">
                        {/* Profile Picture */}
                        <div className="flex flex-col items-center mb-6">
                            <div className="avatar-wrapper relative inline-block">
                                <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-md"
                                    style={{ background: 'linear-gradient(135deg, #2563EB, #6366F1)' }}>
                                    {preview
                                        ? <img src={preview} className="w-full h-full object-cover" alt="Profile" />
                                        : <div className="w-full h-full flex items-center justify-center text-white text-3xl font-bold">
                                            {user?.name?.[0]?.toUpperCase() || 'U'}
                                        </div>
                                    }
                                </div>
                                <div className="avatar-overlay" onClick={() => fileRef.current?.click()}>
                                    <Camera size={20} className="text-white" />
                                </div>
                            </div>
                            <input ref={fileRef} type="file" accept="image/*" onChange={handleImageSelect} className="hidden" />
                            <button type="button" onClick={() => fileRef.current?.click()}
                                className="mt-2 text-xs font-medium px-3 py-1.5 rounded-lg border border-border hover:bg-background transition-colors text-text-secondary">
                                {uploading ? 'Uploading...' : 'Change Photo'}
                            </button>
                        </div>

                        <div className="space-y-4">
                            <FloatInput label="Full Name" value={form.name} onChange={set('name')} />
                            <div className="input-group">
                                <input type="text" value={user?.username ? `@${user.username}` : ''} readOnly placeholder=" "
                                    style={{ background: '#F8F9FA', cursor: 'not-allowed' }} />
                                <label>Username (readonly)</label>
                            </div>
                            <div className="input-group">
                                <input type="email" value={user?.email || ''} readOnly placeholder=" "
                                    style={{ background: '#F8F9FA', cursor: 'not-allowed' }} />
                                <label>Email (readonly)</label>
                            </div>
                            <FloatInput label="Roll Number" value={form.rollNumber} onChange={set('rollNumber')} placeholder="e.g. 21BCS001" />
                            <div className="input-group">
                                <textarea value={form.bio} onChange={set('bio')} placeholder=" " rows={3}
                                    style={{ paddingTop: 22, resize: 'vertical' }} />
                                <label>Bio / About Me</label>
                            </div>
                            <FloatSelect label="Year" value={form.year} onChange={set('year')} options={YEARS} />
                        </div>
                    </SectionCard>

                    {/* Section 2: Academic Info */}
                    <SectionCard icon={GraduationCap} title="Academic Info">
                        <div className="space-y-4">
                            <FloatInput label="College Name" value={form.college} onChange={set('college')} />
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
                            <div className="grid grid-cols-2 gap-4">
                                <FloatSelect label="Branch" value={form.branch} onChange={set('branch')} options={BRANCHES} />
                                <FloatSelect label="Section" value={form.section} onChange={set('section')} options={SECTIONS} />
                            </div>
                            <FloatInput label="LeetCode Rank (enter your LC ranking number)" value={form.leetcodeRank} onChange={set('leetcodeRank')} placeholder="e.g. 45231" />
                        </div>
                    </SectionCard>

                    {/* Section 3: Social Links */}
                    <SectionCard icon={Link2} title="Social Links">
                        <div className="space-y-4">
                            {[
                                { key: 'githubUrl', label: 'GitHub URL', placeholder: 'https://github.com/username' },
                                { key: 'linkedinUrl', label: 'LinkedIn URL', placeholder: 'https://linkedin.com/in/username' },
                                { key: 'leetcodeUrl', label: 'LeetCode URL', placeholder: 'https://leetcode.com/username' },
                                { key: 'hackerrankUrl', label: 'HackerRank URL', placeholder: 'https://hackerrank.com/username' },
                                { key: 'portfolioUrl', label: 'Portfolio URL', placeholder: 'https://yourportfolio.com' },
                                { key: 'twitterUrl', label: 'Twitter/X URL', placeholder: 'https://twitter.com/username' },
                            ].map(({ key, label, placeholder }) => (
                                <div key={key} className="input-group">
                                    <input type="url" value={form[key] || ''} onChange={set(key)} placeholder={placeholder} />
                                    <label>{label}</label>
                                </div>
                            ))}
                        </div>
                    </SectionCard>

                    {/* Section 4: Rankings (readonly) */}
                    <SectionCard icon={Trophy} title="Rankings (Auto Calculated)">
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                            <RankBadge label="Global Rank" value={user?.globalRank || 0} icon="🌍" />
                            <RankBadge label="College Rank" value={user?.collegeRank || 0} icon="🏫" />
                            <RankBadge label="Branch Rank" value={user?.branchRank || 0} icon="📚" />
                            <RankBadge label="Section Rank" value={user?.sectionRank || 0} icon="👥" />
                        </div>
                        <p className="text-xs text-text-secondary mt-3 text-center">
                            Rankings are calculated automatically based on your scores and updated periodically.
                        </p>
                    </SectionCard>

                    <button type="submit" disabled={saving || uploading}
                        className="btn-primary w-full py-3.5 flex items-center justify-center gap-2 text-base">
                        {saving || uploading
                            ? <><Loader2 size={18} className="animate-spin" /> Saving...</>
                            : <><Save size={18} /> Save Changes</>
                        }
                    </button>
                </form>
            </div>
        </AppLayout>
    );
}
