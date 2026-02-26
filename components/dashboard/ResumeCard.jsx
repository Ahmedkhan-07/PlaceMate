'use client';
import { useState, useRef } from 'react';
import { FileText, Upload, BarChart2, ChevronRight, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

function CircularProgress({ score }) {
    const radius = 30;
    const circ = 2 * Math.PI * radius;
    const filled = (score / 100) * circ;
    const color = score >= 70 ? '#16A34A' : score >= 40 ? '#D97706' : '#DC2626';

    return (
        <div className="relative w-20 h-20 flex items-center justify-center">
            <svg width="80" height="80" className="circular-progress absolute inset-0">
                <circle cx="40" cy="40" r={radius} fill="none" stroke="#E2E8F0" strokeWidth="6" />
                <circle cx="40" cy="40" r={radius} fill="none" stroke={color} strokeWidth="6"
                    strokeDasharray={circ} strokeDashoffset={circ - filled}
                    strokeLinecap="round" style={{ transition: 'stroke-dashoffset 0.5s ease' }} />
            </svg>
            <span className="text-lg font-black" style={{ color }}>{score}</span>
        </div>
    );
}

export default function ResumeCard({ user }) {
    const router = useRouter();
    const [uploading, setUploading] = useState(false);
    const fileRef = useRef();

    const handleUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setUploading(true);
        try {
            const token = localStorage.getItem('placemate_token');
            const fd = new FormData();
            fd.append('file', file);
            await fetch('/api/resume/upload', {
                method: 'POST',
                headers: { Authorization: `Bearer ${token}` },
                body: fd,
            });
            router.refresh();
        } catch {
            // silently handle
        } finally {
            setUploading(false);
        }
    };

    const hasResume = !!user?.resumeUrl;
    const score = user?.resumeScore || 0;
    const suggestions = user?.resumeSuggestions || [];
    const filename = user?.resumeFilename || 'resume.pdf';
    const uploadDate = user?.resumeUploadDate
        ? new Date(user.resumeUploadDate).toLocaleDateString('en', { month: 'short', day: 'numeric', year: 'numeric' })
        : null;

    return (
        <div className="bg-white rounded-2xl border border-border shadow-sm p-5">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                        style={{ background: 'linear-gradient(135deg, #2563EB22, #6366F122)' }}>
                        <FileText size={16} style={{ color: '#2563EB' }} />
                    </div>
                    <h3 className="font-semibold text-text-primary text-sm">Resume</h3>
                </div>
                <button
                    onClick={() => fileRef.current?.click()}
                    disabled={uploading}
                    className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg border border-border hover:bg-background hover:border-primary transition-all text-text-secondary hover:text-primary"
                >
                    {uploading ? <Loader2 size={12} className="animate-spin" /> : <Upload size={12} />}
                    {uploading ? 'Uploading...' : 'Upload New'}
                </button>
                <input ref={fileRef} type="file" accept=".pdf,.doc,.docx" onChange={handleUpload} className="hidden" />
            </div>

            {hasResume ? (
                <div className="space-y-4">
                    {/* File info + score */}
                    <div className="flex items-center gap-4">
                        <CircularProgress score={score} />
                        <div className="flex-1 min-w-0">
                            <p className="font-semibold text-text-primary text-sm truncate">{filename}</p>
                            <p className="text-xs text-text-secondary mt-0.5">{uploadDate}</p>
                            <div className="flex items-center gap-1 mt-1">
                                <BarChart2 size={12} style={{ color: '#2563EB' }} />
                                <span className="text-xs font-medium" style={{ color: '#2563EB' }}>AI Score: {score}/100</span>
                            </div>
                        </div>
                    </div>

                    {/* AI Suggestions */}
                    {suggestions.length > 0 && (
                        <div className="bg-background rounded-xl p-3 space-y-1.5">
                            <p className="text-xs font-semibold text-text-primary mb-2">Top AI Suggestions</p>
                            {suggestions.slice(0, 3).map((s, i) => (
                                <div key={i} className="flex items-start gap-1.5">
                                    <span className="text-xs mt-px" style={{ color: '#F59E0B' }}>•</span>
                                    <span className="text-xs text-text-secondary">{s}</span>
                                </div>
                            ))}
                        </div>
                    )}

                    <button
                        onClick={() => router.push('/profile/settings')}
                        className="w-full flex items-center justify-between py-2 px-3 rounded-xl text-xs font-medium border border-border hover:bg-background transition-colors text-text-primary"
                    >
                        <span>View Full Analysis</span>
                        <ChevronRight size={14} />
                    </button>
                </div>
            ) : (
                /* No resume — upload prompt */
                <div
                    onClick={() => fileRef.current?.click()}
                    className="border-2 border-dashed border-border rounded-xl p-6 text-center cursor-pointer hover:border-primary/50 hover:bg-background transition-all"
                >
                    <div className="w-10 h-10 rounded-xl mx-auto mb-2 flex items-center justify-center"
                        style={{ background: 'linear-gradient(135deg, #2563EB15, #6366F115)' }}>
                        <Upload size={18} style={{ color: '#2563EB' }} />
                    </div>
                    <p className="text-sm font-semibold text-text-primary">Upload your Resume</p>
                    <p className="text-xs text-text-secondary mt-1">PDF, DOC, DOCX — Get AI score & suggestions</p>
                </div>
            )}
        </div>
    );
}
