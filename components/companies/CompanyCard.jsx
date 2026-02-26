'use client';
import { ExternalLink, Globe, Briefcase } from 'lucide-react';

const CATEGORY_COLORS = {
    'FAANG': { bg: '#EFF6FF', text: '#2563EB', border: '#BFDBFE' },
    'Product': { bg: '#F0FDF4', text: '#16A34A', border: '#BBF7D0' },
    'Service': { bg: '#FFF7ED', text: '#D97706', border: '#FED7AA' },
    'Startup': { bg: '#FDF4FF', text: '#9333EA', border: '#E9D5FF' },
    'Consulting': { bg: '#F0F9FF', text: '#0369A1', border: '#BAE6FD' },
    'Finance': { bg: '#FEFCE8', text: '#A16207', border: '#FEF08A' },
    'Core': { bg: '#FFF1F2', text: '#BE123C', border: '#FECDD3' },
    'Mass Recruiter': { bg: '#F8FAFC', text: '#64748B', border: '#E2E8F0' },
};

const STATUS_CONFIG = {
    'Not Applied': { bg: '#F8FAFC', text: '#64748B' },
    'Applied': { bg: '#EFF6FF', text: '#2563EB' },
    'In Process': { bg: '#FFF7ED', text: '#D97706' },
    'Rejected': { bg: '#FFF1F2', text: '#BE123C' },
    'Offered': { bg: '#F0FDF4', text: '#16A34A' },
};

export default function CompanyCard({ company, onStatusChange }) {
    const catStyle = CATEGORY_COLORS[company.category] || CATEGORY_COLORS['Mass Recruiter'];
    const statusStyle = STATUS_CONFIG[company.status] || STATUS_CONFIG['Not Applied'];
    const applyUrl = company.applyUrl || company.website;

    return (
        <div className="bg-white border border-border rounded-2xl p-4 hover:border-primary/30 hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 group">
            {/* Header */}
            <div className="flex items-start gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border border-border"
                    style={{ background: catStyle.bg }}>
                    <Briefcase size={16} style={{ color: catStyle.text }} />
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                        <h3 className="font-semibold text-text-primary text-sm truncate">{company.name}</h3>
                        {company.website && (
                            <a href={company.website} target="_blank" rel="noopener noreferrer"
                                className="text-text-secondary hover:text-primary transition-colors shrink-0 opacity-0 group-hover:opacity-100">
                                <ExternalLink size={12} />
                            </a>
                        )}
                    </div>
                    <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                        <span className="text-xs font-medium px-2 py-0.5 rounded-full border"
                            style={{ background: catStyle.bg, color: catStyle.text, borderColor: catStyle.border }}>
                            {company.category}
                        </span>
                        <span className="text-xs font-medium px-2 py-0.5 rounded-full"
                            style={{ background: statusStyle.bg, color: statusStyle.text }}>
                            {company.status || 'Not Applied'}
                        </span>
                    </div>
                </div>
            </div>

            {/* Status selector */}
            {onStatusChange && (
                <select
                    value={company.status || 'Not Applied'}
                    onChange={e => onStatusChange(company.name, e.target.value)}
                    className="w-full bg-background border border-border rounded-xl px-3 py-1.5 text-xs text-text-primary focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 mb-2 transition-all"
                >
                    {Object.keys(STATUS_CONFIG).map(s => (
                        <option key={s} value={s}>{s}</option>
                    ))}
                </select>
            )}

            {/* Apply Now button */}
            {applyUrl && (
                <a
                    href={applyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-1.5 w-full py-2 px-3 rounded-xl text-xs font-semibold text-white transition-all hover:shadow-md hover:-translate-y-0.5 active:scale-95"
                    style={{ background: 'linear-gradient(135deg, #2563EB, #6366F1)' }}
                >
                    <ExternalLink size={12} />
                    Apply Now
                </a>
            )}
        </div>
    );
}
