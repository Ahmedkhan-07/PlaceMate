'use client';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import { Trophy, XCircle, RotateCcw, Download } from 'lucide-react';

export default function ResultModal({ isOpen, onClose, result, onRetry, onDownload }) {
    if (!result) return null;
    const passed = result.passed;

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="sm">
            <div className="text-center space-y-5">
                <div className={`w-20 h-20 rounded-full mx-auto flex items-center justify-center ${passed ? 'bg-emerald-500/20' : 'bg-red-500/20'}`}>
                    {passed
                        ? <Trophy className="h-10 w-10 text-amber-400" />
                        : <XCircle className="h-10 w-10 text-red-400" />
                    }
                </div>
                <div>
                    <h2 className={`text-2xl font-bold ${passed ? 'text-emerald-400' : 'text-red-400'}`}>
                        {passed ? '🎉 You Passed!' : '😔 Not This Time'}
                    </h2>
                    <p className="text-gray-500 text-sm mt-1">{result.message}</p>
                </div>

                {result.scores && (
                    <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 space-y-2 text-left">
                        {Object.entries(result.scores).map(([round, score]) => (
                            <div key={round} className="flex justify-between items-center">
                                <span className="text-sm text-gray-500 capitalize">{round}</span>
                                <span className={`text-sm font-semibold ${score >= 60 ? 'text-emerald-400' : 'text-red-400'}`}>{score}%</span>
                            </div>
                        ))}
                    </div>
                )}

                <div className="flex gap-3">
                    {passed && onDownload && (
                        <Button onClick={onDownload} icon={Download} fullWidth>
                            Get Certificate
                        </Button>
                    )}
                    <Button variant="outline" onClick={onRetry} icon={RotateCcw} fullWidth>
                        Try Again
                    </Button>
                </div>
            </div>
        </Modal>
    );
}
