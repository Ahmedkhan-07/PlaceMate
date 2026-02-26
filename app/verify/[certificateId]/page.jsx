'use client';
import { useEffect, useState } from 'react';
import CertificateViewer from '@/components/certificates/CertificateViewer';
import ShareModal from '@/components/certificates/ShareModal';
import { CheckCircle, XCircle, Share2 } from 'lucide-react';
import Link from 'next/link';
import Button from '@/components/ui/Button';

export default function VerifyPage({ params }) {
    const [cert, setCert] = useState(null);
    const [loading, setLoading] = useState(true);
    const [shareOpen, setShareOpen] = useState(false);

    useEffect(() => {
        async function load() {
            try {
                const res = await fetch(`/api/certificate/verify/${params.certificateId}`);
                const data = await res.json();
                if (data.certificate) setCert(data.certificate);
            } catch { } finally { setLoading(false); }
        }
        load();
    }, [params.certificateId]);

    return (
        <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-6">
            <div className="w-full max-w-2xl space-y-6">
                <div className="text-center">
                    <Link href="/" className="text-2xl font-bold text-white">PlaceMate</Link>
                    <p className="text-slate-400 text-sm mt-1">Certificate Verification</p>
                </div>

                {loading ? (
                    <div className="text-center py-16 text-slate-400">Verifying certificate...</div>
                ) : !cert ? (
                    <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-8 text-center">
                        <XCircle className="h-12 w-12 text-red-400 mx-auto mb-3" />
                        <h2 className="text-lg font-bold text-red-400">Certificate Not Found</h2>
                        <p className="text-slate-400 text-sm mt-1">This certificate ID is invalid or has been revoked.</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-4 py-3">
                            <CheckCircle className="h-5 w-5" />
                            <span className="font-semibold">Verified — This is an authentic PlaceMate certificate</span>
                        </div>
                        <CertificateViewer certificate={cert} />
                        <Button variant="outline" icon={Share2} onClick={() => setShareOpen(true)} fullWidth>
                            Share Certificate
                        </Button>
                    </div>
                )}

                {shareOpen && cert && (
                    <ShareModal isOpen={shareOpen} onClose={() => setShareOpen(false)} certificate={cert} />
                )}
            </div>
        </div>
    );
}
