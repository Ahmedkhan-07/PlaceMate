'use client';
import dynamic from 'next/dynamic';
import { useEffect, useRef } from 'react';

const MonacoEditor = dynamic(() => import('@monaco-editor/react'), { ssr: false });

const LANG_MAP = {
    javascript: 'javascript',
    python: 'python',
    java: 'java',
    cpp: 'cpp',
    c: 'c',
};

export default function CodeEditor({ code, onChange, language = 'python', height = '400px' }) {
    return (
        <div className="rounded-xl overflow-hidden border border-gray-200">
            <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 border-b border-gray-200">
                <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500/80" />
                    <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                    <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                </div>
                <span className="text-xs text-gray-500 ml-2">{language}</span>
            </div>
            <MonacoEditor
                height={height}
                language={LANG_MAP[language] || 'python'}
                value={code}
                onChange={onChange}
                theme="vs-dark"
                options={{
                    fontSize: 14,
                    fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                    minimap: { enabled: false },
                    scrollBeyondLastLine: false,
                    lineNumbers: 'on',
                    tabSize: 2,
                    wordWrap: 'on',
                    padding: { top: 16 },
                    smoothScrolling: true,
                    cursorBlinking: 'smooth',
                    renderLineHighlight: 'all',
                }}
            />
        </div>
    );
}
