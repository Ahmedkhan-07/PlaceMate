'use client';
import { Award, GraduationCap, CheckCircle } from 'lucide-react';
import { format } from 'date-fns';

export default function CertificateViewer({ certificate }) {
    if (!certificate) return null;

    return (
        <div
            id="certificate-viewer"
            className="relative bg-gradient-to-br from-gray-50 via-emerald-950 to-gray-50 border-2 border-emerald-600/30 rounded-2xl p-10 text-center overflow-hidden"
        >
            {/* Corner ornaments */}
            <div className="absolute top-4 left-4 w-12 h-12 border-t-2 border-l-2 border-emerald-600/30 rounded-tl-lg" />
            <div className="absolute top-4 right-4 w-12 h-12 border-t-2 border-r-2 border-emerald-600/30 rounded-tr-lg" />
            <div className="absolute bottom-4 left-4 w-12 h-12 border-b-2 border-l-2 border-emerald-600/30 rounded-bl-lg" />
            <div className="absolute bottom-4 right-4 w-12 h-12 border-b-2 border-r-2 border-emerald-600/30 rounded-br-lg" />

            <div className="flex justify-center mb-6">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-amber-400/20 to-emerald-600/20 border-2 border-amber-400/30 flex items-center justify-center">
                    <Award className="h-10 w-10 text-amber-400" />
                </div>
            </div>

            <div className="flex items-center justify-center gap-2 mb-2">
                <GraduationCap className="h-5 w-5 text-emerald-700" />
                <p className="text-sm text-emerald-700 font-semibold uppercase tracking-widest">PlaceMate</p>
            </div>

            <h1 className="text-3xl font-bold text-white mb-1">Certificate of Achievement</h1>
            <p className="text-gray-500 mb-8">This is to certify that</p>

            <p className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-700 to-purple-400 mb-6">
                {certificate.userName}
            </p>

            <p className="text-gray-700 mb-2">has successfully completed the</p>
            <p className="text-xl font-semibold text-white mb-8">{certificate.title || 'Mock Placement Drive'}</p>

            <div className="flex justify-center gap-8 mb-8">
                <div className="text-center">
                    <p className="text-2xl font-bold text-emerald-400">{certificate.score}%</p>
                    <p className="text-xs text-gray-400">Overall Score</p>
                </div>
            </div>

            <div className="flex items-center justify-center gap-1.5 text-xs text-gray-400 mt-4">
                <CheckCircle className="h-3.5 w-3.5 text-emerald-400" />
                <span>Issued {certificate.createdAt ? format(new Date(certificate.createdAt), 'MMMM d, yyyy') : ''}</span>
                <span>·</span>
                <span className="font-mono">{certificate.certificateId}</span>
            </div>
        </div>
    );
}
