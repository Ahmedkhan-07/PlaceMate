'use client';
import { useEffect, useState } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import CertificateCard from '@/components/certificates/CertificateCard';
import CertificateViewer from '@/components/certificates/CertificateViewer';
import ShareModal from '@/components/certificates/ShareModal';
import { Award, Share2, Download } from 'lucide-react';
import Button from '@/components/ui/Button';

export default function CertificatesPage() {
    const [certificates, setCertificates] = useState([]);
    const [selected, setSelected] = useState(null);
    const [shareOpen, setShareOpen] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function load() {
            try {
                const token = localStorage.getItem('placemate_token');
                const res = await fetch('/api/certificate/generate', { headers: { Authorization: `Bearer ${token}` } });
                const data = await res.json();
                setCertificates(data.certificates || []);
            } catch { } finally { setLoading(false); }
        }
        load();
    }, []);

    return (
        <AppLayout>
            <div className="space-y-6">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center">
                        <Award className="h-5 w-5 text-amber-400" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-white">My Certificates</h1>
                        <p className="text-gray-500 text-sm">Earned through mock drives and achievements</p>
                    </div>
                </div>

                {loading ? (
                    <div className="text-center py-16 text-gray-500">Loading...</div>
                ) : certificates.length === 0 ? (
                    <div className="text-center py-16">
                        <Award className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-500">No certificates yet. Complete a Mock Drive to earn one!</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        {/* List */}
                        <div className="space-y-3">
                            {certificates.map((cert, i) => (
                                <div key={i} onClick={() => setSelected(cert)} className="cursor-pointer">
                                    <CertificateCard certificate={cert} />
                                </div>
                            ))}
                        </div>
                        {/* Viewer */}
                        {selected && (
                            <div className="space-y-3">
                                <CertificateViewer certificate={selected} />
                                <div className="flex gap-3">
                                    <Button variant="outline" icon={Share2} onClick={() => setShareOpen(true)} fullWidth>
                                        Share
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {shareOpen && selected && (
                    <ShareModal isOpen={shareOpen} onClose={() => setShareOpen(false)} certificate={selected} />
                )}
            </div>
        </AppLayout>
    );
}
