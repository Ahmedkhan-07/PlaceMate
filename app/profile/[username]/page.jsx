'use client';
import { useEffect, useState } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { useAuth } from '@/context/AuthContext';
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import Link from 'next/link';
import { ExternalLink, Award } from 'lucide-react';

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
    { key: 'githubUrl', label: 'GitHub', emoji: '🐙', color: '#24292E' },
    { key: 'linkedinUrl', label: 'LinkedIn', emoji: 'in', color: '#0077B5' },
    { key: 'leetcodeUrl', label: 'LeetCode', emoji: '🟠', color: '#F89F1B' },
    { key: 'hackerrankUrl', label: 'HackerRank', emoji: '🟢', color: '#2EC866' },
    { key: 'portfolioUrl', label: 'Portfolio', emoji: '🌐', color: '#2563EB' },
    { key: 'twitterUrl', label: 'Twitter/X', emoji: '𝕏', color: '#000000' },
];

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
                            <h1 className="text-2xl font-black text-text-primary">{profile.name}</h1>
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

                {/* Social Links */}
                {SOCIAL_LINKS.some(s => profile[s.key]) && (
                    <div className="bg-white rounded-2xl border border-border p-6 shadow-sm">
                        <h3 className="font-semibold text-text-primary mb-4">Connect</h3>
                        <div className="flex flex-wrap gap-2">
                            {SOCIAL_LINKS.map(({ key, label, emoji, color }) => {
                                const url = profile[key];
                                if (!url) return null;
                                return (
                                    <a key={key} href={url} target="_blank" rel="noopener noreferrer"
                                        className="flex items-center gap-2 px-4 py-2 rounded-xl text-white font-medium text-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
                                        style={{ background: color }}>
                                        <span>{emoji}</span>
                                        <span>{label}</span>
                                        <ExternalLink size={12} className="opacity-70" />
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
