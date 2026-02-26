'use client';
import { useState } from 'react';
import { Plus, X, Terminal } from 'lucide-react';
import Button from '@/components/ui/Button';

export default function TestCasePanel({ testCases = [], onRun, running }) {
    const [cases, setCases] = useState(testCases.length ? testCases : [{ input: '', expectedOutput: '' }]);
    const [activeTab, setActiveTab] = useState(0);

    const addCase = () => {
        setCases(c => [...c, { input: '', expectedOutput: '' }]);
        setActiveTab(cases.length);
    };

    const removeCase = (i) => {
        if (cases.length === 1) return;
        const next = cases.filter((_, idx) => idx !== i);
        setCases(next);
        setActiveTab(Math.max(0, i - 1));
    };

    const updateCase = (i, field, value) => {
        setCases(c => c.map((tc, idx) => idx === i ? { ...tc, [field]: value } : tc));
    };

    return (
        <div className="border border-gray-200 rounded-xl overflow-hidden">
            <div className="flex items-center gap-1 px-3 py-2 bg-gray-50 border-b border-gray-200 overflow-x-auto">
                {cases.map((_, i) => (
                    <div key={i} className="flex items-center shrink-0">
                        <button
                            onClick={() => setActiveTab(i)}
                            className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${activeTab === i ? 'bg-emerald-700 text-white' : 'text-gray-500 hover:text-gray-800'}`}
                        >
                            Case {i + 1}
                        </button>
                        {cases.length > 1 && (
                            <button onClick={() => removeCase(i)} className="ml-0.5 text-gray-300 hover:text-red-400 transition-colors">
                                <X className="h-3 w-3" />
                            </button>
                        )}
                    </div>
                ))}
                <button onClick={addCase} className="shrink-0 p-1 text-gray-400 hover:text-gray-700 transition-colors">
                    <Plus className="h-3.5 w-3.5" />
                </button>
            </div>

            <div className="p-3 space-y-3 bg-gray-50">
                <div>
                    <label className="text-xs text-gray-500 mb-1 block">Input</label>
                    <textarea
                        value={cases[activeTab]?.input || ''}
                        onChange={e => updateCase(activeTab, 'input', e.target.value)}
                        rows={3}
                        className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 font-mono resize-none focus:outline-none focus:border-emerald-700"
                        placeholder="Enter input..."
                    />
                </div>

                <Button
                    onClick={() => onRun?.(cases)}
                    loading={running}
                    icon={Terminal}
                    size="sm"
                    fullWidth
                >
                    Run Code
                </Button>
            </div>
        </div>
    );
}
