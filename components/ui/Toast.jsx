'use client';
import { useEffect } from 'react';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';

const icons = {
    success: CheckCircle,
    error: XCircle,
    warning: AlertCircle,
    info: Info,
};

const styles = {
    success: 'border-emerald-300 bg-emerald-50 text-emerald-800',
    error: 'border-red-300 bg-red-50 text-red-800',
    warning: 'border-amber-300 bg-amber-50 text-amber-800',
    info: 'border-emerald-300 bg-emerald-50 text-emerald-800',
};

export function ToastItem({ toast, onRemove }) {
    const Icon = icons[toast.type] || Info;

    useEffect(() => {
        const timer = setTimeout(() => onRemove(toast.id), toast.duration || 4000);
        return () => clearTimeout(timer);
    }, [toast.id, toast.duration, onRemove]);

    return (
        <div className={`
      flex items-start gap-3 px-4 py-3 rounded-xl border backdrop-blur-sm
      shadow-2xl shadow-black/10 min-w-72 max-w-sm
      ${styles[toast.type]}
      animate-in slide-in-from-right-full duration-300
    `}>
            <Icon className="h-5 w-5 shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
                {toast.title && <p className="text-sm font-semibold">{toast.title}</p>}
                <p className="text-sm opacity-90">{toast.message}</p>
            </div>
            <button onClick={() => onRemove(toast.id)} className="shrink-0 opacity-60 hover:opacity-100 transition-opacity">
                <X className="h-4 w-4" />
            </button>
        </div>
    );
}

export default function Toast({ toasts, onRemove }) {
    return (
        <div className="fixed bottom-4 right-4 z-[9999] flex flex-col gap-2">
            {toasts.map(toast => (
                <ToastItem key={toast.id} toast={toast} onRemove={onRemove} />
            ))}
        </div>
    );
}
