'use client';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import { Copy, Twitter, Linkedin, Check } from 'lucide-react';
import { useState } from 'react';

export default function ShareModal({ isOpen, onClose, certificate }) {
    const [copied, setCopied] = useState(false);
    const url = typeof window !== 'undefined'
        ? `${window.location.origin}/verify/${certificate?.certificateId}`
        : '';

    const copy = async () => {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Share Certificate" size="sm">
            <div className="space-y-4">
                <p className="text-sm text-gray-500">Share your achievement with the world!</p>
                <div className="flex gap-2">
                    <input
                        readOnly
                        value={url}
                        className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-700 font-mono truncate"
                    />
                    <Button size="sm" onClick={copy} icon={copied ? Check : Copy} variant={copied ? 'success' : 'primary'}>
                        {copied ? 'Copied!' : 'Copy'}
                    </Button>
                </div>
                <div className="grid grid-cols-2 gap-2">
                    <a
                        href={`https://twitter.com/intent/tweet?text=I just earned a certificate on PlaceMate!&url=${encodeURIComponent(url)}`}
                        target="_blank" rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-sky-500/10 border border-sky-500/20 text-sky-400 text-sm hover:bg-sky-500/20 transition-colors"
                    >
                        <Twitter className="h-4 w-4" /> Twitter
                    </a>
                    <a
                        href={`https://linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`}
                        target="_blank" rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-emerald-50 border border-emerald-600/20 text-emerald-600 text-sm hover:bg-emerald-600/20 transition-colors"
                    >
                        <Linkedin className="h-4 w-4" /> LinkedIn
                    </a>
                </div>
            </div>
        </Modal>
    );
}
