'use client';
import { Award, ExternalLink } from 'lucide-react';
import { format } from 'date-fns';
import Link from 'next/link';

export default function CertificateCard({ certificate }) {
    return (
        <div className="bg-white border border-gray-200 rounded-xl p-5 hover:border-emerald-600/30 transition-all group">
            <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500/20 to-emerald-600/20 border border-amber-500/20 flex items-center justify-center shrink-0">
                    <Award className="h-6 w-6 text-amber-400" />
                </div>
                <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-white text-sm group-hover:text-emerald-800 transition-colors">
                        {certificate.title || 'Mock Drive Certificate'}
                    </h3>
                    <p className="text-xs text-gray-500 mt-0.5">
                        Issued {certificate.createdAt ? format(new Date(certificate.createdAt), 'MMM d, yyyy') : 'Recently'}
                    </p>
                    <p className="text-xs text-emerald-700 mt-1 font-mono">{certificate.certificateId}</p>
                </div>
                <Link
                    href={`/verify/${certificate.certificateId}`}
                    className="shrink-0 text-gray-400 hover:text-emerald-700 transition-colors"
                >
                    <ExternalLink className="h-4 w-4" />
                </Link>
            </div>
        </div>
    );
}
