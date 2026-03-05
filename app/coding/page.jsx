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
import { Wand2 } from 'lucide-react';

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
    const [difficulty, setDifficulty] = useState('medium');
    const [submitting, setSubmitting] = useState(false);
    const [testResults, setTestResults] = useState([]);
    const [showResults, setShowResults] = useState(false);
    const [customInput, setCustomInput] = useState('');

    const generateProblem = async () => {
        setGenerating(true);
        setShowResults(false);
        setTestResults([]);
        try {
            const token = localStorage.getItem('placemate_token');
            const res = await fetch('/api/coding/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify({ language, difficulty }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Failed');
            // Support both { problem } (new) and { problems } (old fallback) shapes
            const p = data.problem || (data.problems || [])[0];
            if (!p) throw new Error('No problem generated');
            setProblem(p);
            setCode(p?.starterCode || DEFAULT_CODE[language]);
            setOutput(null);
        } catch (e) {
            toast.error(e.message);
        } finally {
            setGenerating(false);
        }
    };

    const handleRun = async () => {
        setRunning(true);
        setOutput(null);
        try {
            const token = localStorage.getItem('placemate_token');
            const res = await fetch('/api/coding/execute', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify({ language, code, stdin: customInput || '' }),
            });
            const data = await res.json();
            setOutput(data);
        } catch (e) {
            toast.error('Execution failed');
        } finally {
            setRunning(false);
        }
    };

    const handleSubmit = async () => {
        try {
            setSubmitting(true);
            const token = localStorage.getItem('placemate_token');
            let passed = 0;
            const results = [];

            for (const testCase of problem.testCases) {
                const res = await fetch('/api/coding/execute', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({ code, language, stdin: testCase.input }),
                });
                const data = await res.json();

                const actualOutput = (data.output || data.stdout || '')
                    .trim()
                    .replace(/\r\n/g, '\n')
                    .replace(/\r/g, '\n');
                const expectedOutput = (testCase.output || testCase.expectedOutput || '')
                    .trim()
                    .replace(/\r\n/g, '\n')
                    .replace(/\r/g, '\n');

                const isPassed = actualOutput === expectedOutput;
                if (isPassed) passed++;

                results.push({
                    input: testCase.input,
                    expected: expectedOutput,
                    actual: actualOutput,
                    passed: isPassed,
                });
            }

            const score = Math.round((passed / problem.testCases.length) * 100);
            setTestResults(results);
            setShowResults(true);

            await fetch('/api/scores', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify({
                    round: 'coding',
                    topic: problem.topic || 'General',
                    difficulty,
                    score,
                    totalQuestions: problem.testCases.length,
                    correctAnswers: passed,
                }),
            });

            await fetch('/api/badges/check', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify({ round: 'coding', score }),
            });

            if (passed === problem.testCases.length) {
                toast.success(`Perfect! All ${passed}/${problem.testCases.length} test cases passed! 🎉`);
            } else if (passed > 0) {
                toast(`${passed}/${problem.testCases.length} test cases passed (${score}%)`);
            } else {
                toast.error(`0/${problem.testCases.length} test cases passed. Keep trying!`);
            }
        } catch (error) {
            console.error(error);
            toast.error('Submission failed');
        } finally {
            setSubmitting(false);
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
                        <h1 className="text-2xl font-bold text-text-primary">Coding practice</h1>
                        <p className="text-text-secondary text-sm">AI-generated coding problems with live execution</p>
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

                {/* Difficulty Selector */}
                <div className="flex gap-3 mb-4">
                    {['easy', 'medium', 'hard', 'dynamic'].map(level => (
                        <button
                            key={level}
                            onClick={() => setDifficulty(level)}
                            className={`px-4 py-2 rounded-md font-semibold capitalize transition-colors duration-200 text-sm ${difficulty === level
                                    ? level === 'easy' ? 'bg-success text-white'
                                        : level === 'medium' ? 'bg-warning text-white'
                                            : level === 'hard' ? 'bg-danger text-white'
                                                : 'bg-secondary text-white'
                                    : 'bg-white border border-border text-text-secondary hover:border-primary hover:text-primary'
                                }`}
                        >
                            {level}
                        </button>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {/* Left: Problem */}
                    <div className="bg-white border border-border rounded-xl p-5 h-[600px] overflow-auto">
                        <ProblemStatement problem={problem} />
                    </div>
                    {/* Right: Editor + Test + Submit */}
                    <div className="space-y-3">
                        <CodeEditor code={code} onChange={setCode} language={language} height="380px" />

                        {/* Custom stdin input */}
                        <div>
                            <label className="text-[13px] font-medium text-text-secondary mb-1.5 block">Custom input (stdin)</label>
                            <textarea
                                value={customInput}
                                onChange={e => setCustomInput(e.target.value)}
                                placeholder="Enter input here e.g. 1 2 3 4 5"
                                className="w-full h-24 px-3.5 py-2.5 rounded-md border border-border focus:border-primary outline-none font-mono text-sm resize-none bg-white text-text-primary"
                            />
                        </div>

                        {/* Run + Submit buttons */}
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={handleRun}
                                disabled={running || !code}
                                className="btn-primary px-6 py-2 disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                                {running ? 'Running...' : '▶ Run'}
                            </button>
                            <button
                                onClick={handleSubmit}
                                disabled={submitting || !problem || !code}
                                className="bg-success hover:bg-success-dark text-white font-semibold px-6 py-2 rounded-md transition-colors duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                                {submitting ? 'Submitting...' : 'Submit solution'}
                            </button>
                        </div>

                        <TestCasePanel
                            testCases={problem?.examples || []}
                        />
                        <OutputPanel output={output} />

                        {/* Test Results Panel */}
                        {showResults && (
                            <div className="mt-4 space-y-3">
                                <h3 className="font-semibold text-text-primary text-lg">Test results</h3>
                                {testResults.map((result, index) => (
                                    <div
                                        key={index}
                                        className={`p-4 rounded-xl border ${result.passed ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}
                                    >
                                        <div className="flex items-center gap-2 mb-2">
                                            <span>{result.passed ? '✅' : '❌'}</span>
                                            <span className="font-semibold">
                                                {result.passed ? 'Passed' : 'Failed'} — Test Case {index + 1}
                                            </span>
                                        </div>
                                        <div className="text-sm space-y-1">
                                            <p><span className="font-medium">Input:</span> {result.input}</p>
                                            <p><span className="font-medium">Expected:</span> {result.expected}</p>
                                            <p><span className="font-medium">Your Output:</span> {result.actual}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
