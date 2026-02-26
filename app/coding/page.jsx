'use client';
import { useState } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import CodeEditor from '@/components/coding/CodeEditor';
import ProblemStatement from '@/components/coding/ProblemStatement';
import TestCasePanel from '@/components/coding/TestCasePanel';
import OutputPanel from '@/components/coding/OutputPanel';
import Button from '@/components/ui/Button';
import { Select } from '@/components/ui/Input';
import { useToast } from '@/context/ToastContext';
import { Wand2, Play } from 'lucide-react';

const LANGUAGES = ['python', 'javascript', 'java', 'cpp', 'c'];

const DEFAULT_CODE = {
    python: '# Write your solution here\ndef solution():\n    pass\n',
    javascript: '// Write your solution here\nfunction solution() {\n  \n}\n',
    java: 'public class Solution {\n    public static void main(String[] args) {\n        // Write your solution here\n    }\n}\n',
    cpp: '#include <iostream>\nusing namespace std;\nint main() {\n    // Write your solution here\n    return 0;\n}\n',
    c: '#include <stdio.h>\nint main() {\n    // Write your solution here\n    return 0;\n}\n',
};

export default function CodingPage() {
    const toast = useToast();
    const [language, setLanguage] = useState('python');
    const [code, setCode] = useState(DEFAULT_CODE.python);
    const [problem, setProblem] = useState(null);
    const [output, setOutput] = useState(null);
    const [generating, setGenerating] = useState(false);
    const [running, setRunning] = useState(false);

    const generateProblem = async () => {
        setGenerating(true);
        try {
            const token = localStorage.getItem('placemate_token');
            const res = await fetch('/api/coding/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify({ language, difficulty: 'medium' }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Failed');
            const problems = data.problems || [];
            if (problems.length === 0) throw new Error('No problem generated');
            setProblem(problems[0]);
            setCode(problems[0]?.starterCode || DEFAULT_CODE[language]);
            setOutput(null);
        } catch (e) {
            toast.error(e.message);
        } finally {
            setGenerating(false);
        }
    };

    const runCode = async (testCases) => {
        setRunning(true);
        try {
            const token = localStorage.getItem('placemate_token');
            const res = await fetch('/api/coding/execute', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify({ language, code, stdin: testCases[0]?.input || '' }),
            });
            const data = await res.json();
            setOutput(data);
        } catch (e) {
            toast.error(e.message);
        } finally {
            setRunning(false);
        }
    };

    const handleLangChange = (lang) => {
        setLanguage(lang);
        if (!problem) setCode(DEFAULT_CODE[lang]);
    };

    return (
        <AppLayout>
            <div className="space-y-4">
                <div className="flex items-center justify-between flex-wrap gap-3">
                    <div>
                        <h1 className="text-2xl font-bold text-white">Coding Practice</h1>
                        <p className="text-gray-500 text-sm">AI-generated coding problems with live execution</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Select value={language} onChange={e => handleLangChange(e.target.value)} className="w-36">
                            {LANGUAGES.map(l => <option key={l} value={l}>{l.toUpperCase()}</option>)}
                        </Select>
                        <Button onClick={generateProblem} loading={generating} icon={Wand2} size="sm">
                            Generate Problem
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {/* Left: Problem */}
                    <div className="bg-white border border-gray-200 rounded-xl p-5 h-[600px] overflow-auto">
                        <ProblemStatement problem={problem} />
                    </div>
                    {/* Right: Editor + Test */}
                    <div className="space-y-3">
                        <CodeEditor code={code} onChange={setCode} language={language} height="380px" />
                        <TestCasePanel
                            testCases={problem?.examples || []}
                            onRun={runCode}
                            running={running}
                        />
                        <OutputPanel output={output} />
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
