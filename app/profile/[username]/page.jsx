'use client';
import { useEffect, useState } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { useAuth } from '@/context/AuthContext';
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import Link from 'next/link';
import { ExternalLink, Award, CheckCircle, Github, Linkedin, Globe, Twitter, Code2, Code } from 'lucide-react';

const BADGE_META = {
    'First Step': { emoji: '👣', color: '#6366F1', desc: 'Completed first test' },
    'Aptitude Starter': { emoji: '🧮', color: '#2563EB', desc: 'First aptitude test' },
    'Code Newbie': { emoji: '💻', color: '#0EA5E9', desc: 'First coding problem' },
    'Tech Explorer': { emoji: '🔧', color: '#8B5CF6', desc: 'First technical round' },
    '7 Day Warrior': { emoji: '🔥', color: '#F59E0B', desc: '7 day streak' },
    '30 Day Legend': { emoji: '⚡', color: '#F59E0B', desc: '30 day streak' },
    'Aptitude Master': { emoji: '🎯', color: '#16A34A', desc: 'Scored 90%+ in aptitude' },
    'Coding Champion': { emoji: '🏆', color: '#DC2626', desc: 'Solved 50 problems' },
    'Technical Expert': { emoji: '🔬', color: '#7C3AED', desc: 'Completed all tech topics' },
    'Speed Demon': { emoji: '⚡', color: '#EF4444', desc: 'Finished test in half time' },
    'Placement Ready': { emoji: '🚀', color: '#2563EB', desc: 'Completed mock drive' },
    'Hard Mode Champion': { emoji: '💪', color: '#B45309', desc: 'Hard mock drive passed' },
    'All Rounder': { emoji: '🌟', color: '#F59E0B', desc: '80%+ in all rounds' },
    'Perfect Score': { emoji: '💯', color: '#16A34A', desc: 'Got 100% in any round' },
};

const SOCIAL_LINKS = [
    {
        key: 'linkedinUrl', label: 'LinkedIn',
        color: '#0077B5', bg: '#EFF8FF',
        icon: (<svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>),
    },
    {
        key: 'githubUrl', label: 'GitHub',
        color: '#24292E', bg: '#F6F8FA',
        icon: (<svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" /></svg>),
    },
    {
        key: 'leetcodeUrl', label: 'LeetCode',
        color: '#F89F1B', bg: '#FFFBEB',
        icon: (<svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M13.483 0a1.374 1.374 0 0 0-.961.438L7.116 6.226l-3.854 4.126a5.266 5.266 0 0 0-1.209 2.104 5.35 5.35 0 0 0-.125.513 5.527 5.527 0 0 0 .062 2.362 5.83 5.83 0 0 0 .349 1.017 5.938 5.938 0 0 0 1.271 1.818l4.277 4.193.039.038c2.248 2.165 5.852 2.133 8.063-.074l2.396-2.392c.54-.54.54-1.414.003-1.955a1.378 1.378 0 0 0-1.951-.003l-2.396 2.392a3.021 3.021 0 0 1-4.205.038l-.02-.019-4.276-4.193c-.652-.64-.972-1.469-.948-2.263a2.68 2.68 0 0 1 .066-.523 2.545 2.545 0 0 1 .619-1.164L9.13 8.114c1.058-1.134 3.204-1.27 4.43-.278l3.501 2.831c.593.48 1.461.387 1.94-.207a1.384 1.384 0 0 0-.207-1.943l-3.5-2.831c-.8-.647-1.766-1.045-2.774-1.202l2.015-2.158A1.384 1.384 0 0 0 13.483 0zm-2.866 12.815a1.38 1.38 0 0 0-1.38 1.382 1.38 1.38 0 0 0 1.38 1.382H19.79a1.38 1.38 0 0 0 1.38-1.382 1.38 1.38 0 0 0-1.38-1.382z" /></svg>),
    },
    {
        key: 'hackerrankUrl', label: 'HackerRank',
        color: '#2EC866', bg: '#ECFDF5',
        icon: (<svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M12 0c1.285 0 9.75 4.886 10.392 6 .645 1.115.645 10.885 0 12S13.287 24 12 24s-9.75-4.885-10.395-6c-.641-1.115-.641-10.885 0-12C2.25 4.886 10.715 0 12 0zm2.295 6.799c-.141 0-.258.115-.258.258v3.875H9.963V6.908a.266.266 0 0 0-.265-.265c-.043 0-.087.011-.126.033L7.17 8.002a.268.268 0 0 0-.134.232v7.524a.27.27 0 0 0 .268.268c.044 0 .089-.012.128-.034l2.399-1.327a.268.268 0 0 0 .133-.233v-3.619h4.07v3.759c0 .144.12.26.264.26.043 0 .089-.012.128-.034l2.399-1.327a.267.267 0 0 0 .134-.232V8.317a.269.269 0 0 0-.133-.231l-2.399-1.254a.258.258 0 0 0-.132-.033z" /></svg>),
    },
    {
        key: 'portfolioUrl', label: 'Portfolio',
        color: '#2563EB', bg: '#EFF6FF',
        icon: (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4"><circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /></svg>),
    },
    {
        key: 'twitterUrl', label: 'Twitter / X',
        color: '#000000', bg: '#F8F8F8',
        icon: (<svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.259 5.631zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>),
    },
];

// ─── Profile Completion (owner-only) ────────────────────────────────────────
const COMPLETION_FIELDS = [
    { key: 'profilePicture', label: 'Profile photo' },
    { key: 'bio', label: 'Bio' },
    { key: 'college', label: 'College' },
    { key: 'branch', label: 'Branch' },
    { key: 'year', label: 'Year' },
    { key: 'section', label: 'Section' },
    { key: 'rollNumber', label: 'Roll number' },
    { key: 'linkedinUrl', label: 'LinkedIn' },
    { key: 'githubUrl', label: 'GitHub' },
    { key: 'leetcodeUrl', label: 'LeetCode' },
];

function ProfileCompletion({ profile }) {
    const filled = COMPLETION_FIELDS.filter(f => profile[f.key]);
    const pct = Math.round((filled.length / COMPLETION_FIELDS.length) * 100);
    const missing = COMPLETION_FIELDS.filter(f => !profile[f.key]);
    const isComplete = pct === 100;

    return (
        <div className="bg-white rounded-2xl border border-border p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-text-primary text-sm">Profile completion</h3>
                    {isComplete && (
                        <span className="flex items-center gap-1 text-xs font-semibold text-success bg-green-50 border border-green-200 px-2 py-0.5 rounded-full">
                            <CheckCircle className="w-3 h-3" /> Verified
                        </span>
                    )}
                </div>
                <span className={`text-2xl font-black ${isComplete ? 'text-success' : pct >= 70 ? 'text-primary' : 'text-warning'
                    }`}>{pct}%</span>
            </div>

            {/* Progress bar */}
            <div className="h-2 bg-slate-100 rounded-full overflow-hidden mb-3">
                <div
                    className={`h-full rounded-full transition-all duration-700 ${isComplete ? 'bg-success' : pct >= 70 ? 'bg-primary' : 'bg-warning'
                        }`}
                    style={{ width: `${pct}%` }}
                />
            </div>

            {isComplete ? (
                <p className="text-xs text-success font-medium">🎉 Your profile is fully complete!</p>
            ) : (
                <div>
                    <p className="text-xs text-text-secondary mb-2">Fill in {missing.length} more fields to get your verified badge:</p>
                    <div className="flex flex-wrap gap-1.5">
                        {missing.map(f => (
                            <span key={f.key} className="text-xs bg-slate-100 text-text-secondary px-2 py-0.5 rounded-full">
                                {f.label}
                            </span>
                        ))}
                    </div>
                </div>
            )}

            <Link href="/profile/settings" className="mt-3 btn-primary text-xs py-2 px-4 inline-flex">
                {isComplete ? 'Edit profile' : 'Complete profile'}
            </Link>
        </div>
    );
}

function StatCard({ label, value, sub, color }) {
    return (
        <div className="bg-white rounded-2xl border border-border p-4 shadow-sm text-center">
            <div className="text-2xl font-black" style={{ color: color || '#2563EB' }}>{value}</div>
            <div className="text-sm font-semibold text-text-primary mt-0.5">{label}</div>
            {sub && <div className="text-xs text-text-secondary mt-0.5">{sub}</div>}
        </div>
    );
}

function RankCard({ label, value, icon }) {
    return (
        <div className="bg-white rounded-2xl border border-border p-4 text-center shadow-sm">
            <div className="text-2xl mb-1">{icon}</div>
            <div className="text-xs text-text-secondary font-medium">{label}</div>
            <div className="text-xl font-black mt-0.5" style={{ color: value > 0 ? '#2563EB' : '#94A3B8' }}>
                {value > 0 ? `#${value}` : '—'}
            </div>
        </div>
    );
}

export default function ProfilePage({ params }) {
    const { user: currentUser } = useAuth();
    const [profile, setProfile] = useState(null);
    const [scores, setScores] = useState([]);
    const [certificates, setCertificates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function load() {
            try {
                const token = localStorage.getItem('placemate_token');
                const headers = { Authorization: `Bearer ${token}` };

                // Profile fetch is critical — fail explicitly if it errors
                const profileRes = await fetch(`/api/profile/${params.username}`, { headers });
                const profileData = await profileRes.json();
                if (!profileRes.ok) {
                    setError(profileData.message || 'Profile not found');
                    setLoading(false);
                    return;
                }
                setProfile(profileData.user);

                // Scores and certificates are non-critical — fail silently
                try {
                    const scoresRes = await fetch('/api/scores', { headers });
                    const scoresData = await scoresRes.json();
                    setScores(scoresData.scores || []);
                } catch { /* silent */ }

                try {
                    const certRes = await fetch('/api/certificate', { headers });
                    const certData = await certRes.json();
                    setCertificates(certData.certificates || []);
                } catch { /* silent */ }

            } catch (e) {
                console.error('Profile load error:', e);
                setError('Failed to load profile');
            } finally {
                setLoading(false);
            }
        }
        load();
    }, [params.username]);

    if (loading) return (
        <AppLayout>
            <div className="flex items-center justify-center min-h-64">
                <div className="text-center">
                    <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin mx-auto mb-3" />
                    <p className="text-text-secondary">Loading profile...</p>
                </div>
            </div>
        </AppLayout>
    );

    if (error || !profile) return (
        <AppLayout>
            <div className="text-center py-20">
                <div className="text-5xl mb-4">🔍</div>
                <h2 className="text-xl font-bold text-text-primary">Profile not found</h2>
                <p className="text-text-secondary mt-2">{error || "This user doesn't exist or has a private profile."}</p>
                <Link href="/dashboard" className="inline-block mt-4 btn-primary px-6 py-2 text-sm">
                    Back to Dashboard
                </Link>
            </div>
        </AppLayout>
    );

    const isOwner = currentUser?.username?.toLowerCase() === params.username?.toLowerCase();

    // Profile completion % — calculated for display purposes
    const filledCount = COMPLETION_FIELDS.filter(f => profile[f.key]).length;
    const completionPct = Math.round((filledCount / COMPLETION_FIELDS.length) * 100);
    const isVerified = completionPct === 100;

    const aptScores = scores.filter(s => s.round === 'aptitude' || s.type === 'aptitude');
    const codingScores = scores.filter(s => s.round === 'coding' || s.type === 'coding');
    const techScores = scores.filter(s => s.round === 'technical' || s.type === 'technical');
    const avg = (arr) => arr.length ? Math.round(arr.reduce((a, s) => a + (s.percentage || 0), 0) / arr.length) : 0;

    const aptAvg = avg(aptScores);
    const codingAvg = avg(codingScores);
    const techAvg = avg(techScores);

    const radarData = [
        { subject: 'Aptitude', score: aptAvg },
        { subject: 'Coding', score: codingAvg },
        { subject: 'Technical', score: techAvg },
    ];

    const topicMap = {};
    scores.forEach(s => {
        if (s.topic) {
            if (!topicMap[s.topic]) topicMap[s.topic] = { topic: s.topic, scores: [] };
            topicMap[s.topic].scores.push(s.percentage || 0);
        }
    });
    const topicData = Object.values(topicMap).slice(0, 8).map(t => ({
        topic: t.topic.length > 12 ? t.topic.slice(0, 12) + '...' : t.topic,
        score: Math.round(t.scores.reduce((a, b) => a + b, 0) / t.scores.length),
    }));

    const ALL_BADGES = Object.keys(BADGE_META);
    const earnedBadges = [...new Set((profile.badges || []).map(b => b?.name || b).filter(Boolean))];

    return (
        <AppLayout>
            <div className="max-w-4xl mx-auto space-y-6 pb-24">

                {/* Header Card */}
                <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
                    <div className="h-28" style={{ background: 'linear-gradient(135deg, #1E3A5F, #2563EB, #6366F1)' }} />
                    <div className="px-6 pb-6">
                        {/* Avatar row — avatar pokes out of banner, Edit button floats right */}
                        <div className="flex items-end justify-between -mt-12 mb-3">
                            <div className="w-24 h-24 rounded-full border-4 border-white shadow-lg overflow-hidden shrink-0"
                                style={{ background: 'linear-gradient(135deg, #2563EB, #6366F1)' }}>
                                {profile.profilePicture
                                    ? <img src={profile.profilePicture} className="w-full h-full object-cover" alt={profile.name} />
                                    : <div className="w-full h-full flex items-center justify-center text-white text-3xl font-bold">
                                        {profile.name?.[0]?.toUpperCase()}
                                    </div>
                                }
                            </div>
                            {isOwner && (
                                <Link href="/profile/settings" className="btn-primary px-4 py-2 text-sm shrink-0 mb-1">
                                    Edit Profile
                                </Link>
                            )}
                        </div>
                        {/* Text info — always in white area */}
                        <div>
                            <div className="flex items-center gap-2 flex-wrap">
                                <h1 className="text-2xl font-black text-text-primary">{profile.name}</h1>
                                {/* Owner-only verified badge */}
                                {isOwner && isVerified && (
                                    <span className="flex items-center gap-1 text-xs font-semibold text-success bg-green-50 border border-green-200 px-2 py-0.5 rounded-full">
                                        <CheckCircle className="w-3.5 h-3.5" /> Verified
                                    </span>
                                )}
                            </div>
                            <p className="text-sm text-slate-500 mt-0.5">@{profile.username}</p>
                            <div className="flex flex-wrap gap-1.5 mt-2 text-xs text-text-secondary">
                                {profile.college && <span className="bg-slate-100 px-2 py-0.5 rounded-full">🏫 {profile.college}</span>}
                                {profile.branch && <span className="bg-slate-100 px-2 py-0.5 rounded-full">📚 {profile.branch}</span>}
                                {profile.section && <span className="bg-slate-100 px-2 py-0.5 rounded-full">👥 Sec {profile.section}</span>}
                                {profile.year && <span className="bg-slate-100 px-2 py-0.5 rounded-full">📅 {profile.year}</span>}
                                {isOwner && profile.rollNumber && <span className="bg-slate-100 px-2 py-0.5 rounded-full">🎓 {profile.rollNumber}</span>}
                                {profile.leetcodeRank && <span className="bg-amber-50 px-2 py-0.5 rounded-full text-amber-700">🟠 LC #{profile.leetcodeRank}</span>}
                            </div>
                            {profile.bio && (
                                <p className="mt-3 text-sm text-text-secondary border-t border-border pt-3">{profile.bio}</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Owner-only: Profile Completion widget */}
                {isOwner && <ProfileCompletion profile={profile} />}

                {/* Rank Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <RankCard label="Global Rank" value={profile.globalRank} icon="🌍" />
                    <RankCard label="College Rank" value={profile.collegeRank} icon="🏫" />
                    <RankCard label="Branch Rank" value={profile.branchRank} icon="📚" />
                    <RankCard label="Section Rank" value={profile.sectionRank} icon="👥" />
                </div>

                {/* Score Stats */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <StatCard label="Aptitude" value={`${aptAvg}%`} sub={`${aptScores.length} tests`} color="#2563EB" />
                    <StatCard label="Coding" value={codingScores.length} sub="problems solved" color="#6366F1" />
                    <StatCard label="Technical" value={`${techAvg}%`} sub={`${techScores.length} tests`} color="#8B5CF6" />
                    <StatCard label="Total Tests" value={scores.length} sub="completed" color="#16A34A" />
                </div>

                {/* Charts */}
                {scores.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div className="bg-white rounded-2xl border border-border p-5 shadow-sm">
                            <h3 className="font-semibold text-text-primary mb-4">Performance Overview</h3>
                            <ResponsiveContainer width="100%" height={200}>
                                <RadarChart data={radarData}>
                                    <PolarGrid stroke="#E2E8F0" />
                                    <PolarAngleAxis dataKey="subject" tick={{ fontSize: 12, fill: '#64748B' }} />
                                    <Radar name="Score" dataKey="score" stroke="#2563EB" fill="#2563EB" fillOpacity={0.2} />
                                </RadarChart>
                            </ResponsiveContainer>
                        </div>
                        {topicData.length > 0 && (
                            <div className="bg-white rounded-2xl border border-border p-5 shadow-sm">
                                <h3 className="font-semibold text-text-primary mb-4">Topic-wise Scores</h3>
                                <ResponsiveContainer width="100%" height={200}>
                                    <BarChart data={topicData}>
                                        <XAxis dataKey="topic" tick={{ fontSize: 10, fill: '#64748B' }} />
                                        <YAxis domain={[0, 100]} tick={{ fontSize: 10 }} />
                                        <Tooltip formatter={(v) => [`${v}%`, 'Score']} />
                                        <Bar dataKey="score" fill="#2563EB" radius={[4, 4, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        )}
                    </div>
                )}

                {/* Badges */}
                <div className="bg-white rounded-2xl border border-border p-6 shadow-sm">
                    <h3 className="font-semibold text-text-primary mb-4">Achievements & Badges</h3>
                    <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
                        {ALL_BADGES.map(badgeId => {
                            const meta = BADGE_META[badgeId];
                            const earned = earnedBadges.includes(badgeId);
                            return (
                                <div key={badgeId} title={meta.desc}
                                    className={`flex flex-col items-center gap-1 p-3 rounded-xl border transition-all ${earned ? 'border-transparent shadow-sm' : 'border-border opacity-40 grayscale'}`}
                                    style={earned ? { background: `${meta.color}15`, borderColor: `${meta.color}40` } : {}}>
                                    <div className="text-2xl">{meta.emoji}</div>
                                    <div className="text-xs font-medium text-center leading-tight" style={{ color: earned ? meta.color : '#94A3B8' }}>
                                        {badgeId}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Certificates */}
                {certificates.length > 0 && (
                    <div className="bg-white rounded-2xl border border-border p-6 shadow-sm">
                        <h3 className="font-semibold text-text-primary mb-4">Certificates</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {certificates.map(cert => (
                                <div key={cert._id} className="border border-border rounded-xl p-4 flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                                        style={{ background: 'linear-gradient(135deg, #F59E0B22, #D9770622)' }}>
                                        <Award size={18} style={{ color: '#F59E0B' }} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="font-semibold text-sm text-text-primary truncate">{cert.companyName || 'Mock Drive'}</div>
                                        <div className="text-xs text-text-secondary">{cert.difficulty} • {cert.overallScore}%</div>
                                    </div>
                                    {cert.certificateUrl && (
                                        <a href={cert.certificateUrl} target="_blank" rel="noopener noreferrer"
                                            className="text-primary hover:text-primary-dark transition-colors">
                                            <ExternalLink size={16} />
                                        </a>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Social Links — visible to everyone if profile has links */}
                {SOCIAL_LINKS.some(s => profile[s.key]) && (
                    <div className="bg-white rounded-2xl border border-border p-6 shadow-sm">
                        <h3 className="font-semibold text-text-primary mb-4">Connect</h3>
                        <div className="flex flex-wrap gap-2.5">
                            {SOCIAL_LINKS.map(({ key, label, color, bg, icon }) => {
                                const url = profile[key];
                                if (!url) return null;
                                return (
                                    <a
                                        key={key}
                                        href={url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-medium transition-colors duration-200"
                                        style={{
                                            color: color,
                                            background: bg,
                                            borderColor: `${color}30`,
                                        }}
                                        onMouseEnter={e => { e.currentTarget.style.background = `${color}18`; e.currentTarget.style.borderColor = `${color}70`; }}
                                        onMouseLeave={e => { e.currentTarget.style.background = bg; e.currentTarget.style.borderColor = `${color}30`; }}
                                    >
                                        {icon}
                                        <span>{label}</span>
                                        <ExternalLink size={11} className="opacity-50" />
                                    </a>
                                );
                            })}
                        </div>
                    </div>
                )}

            </div>
        </AppLayout>
    );
}
