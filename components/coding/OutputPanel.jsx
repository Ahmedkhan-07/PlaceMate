'use client';
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react';

export default function OutputPanel({ output }) {
    if (!output) return (
        <div className="border border-gray-200 rounded-xl bg-gray-50 p-4">
            <p className="text-xs text-gray-400 font-mono">Run your code to see output here...</p>
        </div>
    );

    const { stdout, stderr, exitCode, compileOutput, error } = output;
    const hasError = exitCode !== 0 || stderr || error;

    return (
        <div className="border border-gray-200 rounded-xl overflow-hidden">
            <div className={`flex items-center gap-2 px-4 py-2.5 border-b ${hasError ? 'border-red-500/20 bg-red-500/5' : 'border-emerald-500/20 bg-emerald-500/5'}`}>
                {hasError
                    ? <XCircle className="h-4 w-4 text-red-400" />
                    : <CheckCircle className="h-4 w-4 text-emerald-400" />
                }
                <span className={`text-xs font-semibold ${hasError ? 'text-red-400' : 'text-emerald-400'}`}>
                    {hasError ? 'Runtime Error' : 'Success'} · Exit Code: {exitCode}
                </span>
            </div>
            <div className="p-4 bg-gray-50 font-mono text-sm space-y-3 max-h-48 overflow-auto">
                {stdout && (
                    <div>
                        <p className="text-xs text-gray-400 mb-1">Output</p>
                        <pre className="text-gray-800 whitespace-pre-wrap">{stdout}</pre>
                    </div>
                )}
                {stderr && (
                    <div>
                        <p className="text-xs text-red-400 mb-1">Error</p>
                        <pre className="text-red-300 whitespace-pre-wrap text-xs">{stderr}</pre>
                    </div>
                )}
                {compileOutput && (
                    <div>
                        <p className="text-xs text-amber-400 mb-1">Compile Output</p>
                        <pre className="text-amber-300 whitespace-pre-wrap text-xs">{compileOutput}</pre>
                    </div>
                )}
                {!stdout && !stderr && !compileOutput && (
                    <p className="text-gray-400 text-xs">No output</p>
                )}
            </div>
        </div>
    );
}
