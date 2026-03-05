'use client';
import { useEffect } from 'react';
import { X } from 'lucide-react';

export default function Modal({ isOpen, onClose, title, children, size = 'md', className = '' }) {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => { document.body.style.overflow = ''; };
    }, [isOpen]);

    // Close on Escape key
    useEffect(() => {
        if (!isOpen) return;
        const handler = (e) => { if (e.key === 'Escape') onClose(); };
        document.addEventListener('keydown', handler);
        return () => document.removeEventListener('keydown', handler);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const sizes = {
        sm: 'max-w-md',
        md: 'max-w-[540px]',
        lg: 'max-w-2xl',
        xl: 'max-w-4xl',
        full: 'max-w-7xl',
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: 'rgba(0,0,0,0.45)' }}
            onClick={(e) => e.target === e.currentTarget && onClose()}
        >
            <div
                className={`
          relative w-full ${sizes[size]} bg-white dark:bg-gray-800
          rounded-2xl overflow-hidden
          animate-slideUp
          ${className}
        `}
                style={{ boxShadow: '0 20px 60px rgba(0,0,0,0.15)' }}
            >
                {/* Accent strip */}
                <div className="h-1 w-full" style={{ background: 'linear-gradient(90deg, #2563EB, #6366F1)' }} />

                {title && (
                    <div className="flex items-center justify-between px-6 py-4 border-b border-border dark:border-gray-700">
                        <h2 className="text-base font-semibold text-text-primary dark:text-gray-100">{title}</h2>
                        <button
                            onClick={onClose}
                            className="p-1.5 text-text-secondary dark:text-gray-400 hover:text-text-primary dark:text-gray-100 hover:bg-background dark:hover:bg-[#0F172A] dark:bg-[#0F172A] dark:hover:bg-[#0F172A] dark:bg-[#0F172A] rounded-lg transition-colors"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>
                )}
                {!title && (
                    <button
                        onClick={onClose}
                        className="absolute top-5 right-5 p-1.5 text-text-secondary dark:text-gray-400 hover:text-text-primary dark:text-gray-100 hover:bg-background dark:hover:bg-[#0F172A] dark:bg-[#0F172A] dark:hover:bg-[#0F172A] dark:bg-[#0F172A] rounded-lg transition-colors z-10"
                    >
                        <X className="h-4 w-4" />
                    </button>
                )}

                {/* Scrollable content */}
                <div className="p-6 max-h-[80vh] overflow-y-auto">
                    {children}
                </div>
            </div>
        </div>
    );
}
