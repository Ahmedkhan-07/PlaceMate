'use client';
import { useState } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import QuestionCard from '@/components/aptitude/QuestionCard';
import TopicSelector from '@/components/aptitude/TopicSelector';
import ResultSummary from '@/components/aptitude/ResultSummary';
import { useToast } from '@/context/ToastContext';
import { Calculator, ChevronRight, RotateCcw, Sparkles } from 'lucide-react';

const TOPIC_ICONS = { 'Number System': '🔢', 'Percentage': '%', 'Profit & Loss': '💹', 'Time & Work': '⏱', 'Time Speed Distance': '🚗', 'Probability': '🎲', 'Logical Reasoning': '🧠', 'Verbal Ability': '📝', 'Data Interpretation': '📊' };

export default function AptitudePage() {
    const toast = useToast();
    const [phase, setPhase] = useState('select');
    const [questions, setQuestions] = useState([]);
    const [currentIdx, setCurrentIdx] = useState(0);
    const [answers, setAnswers] = useState({});
    const [showResult, setShowResult] = useState(false);
    const [loading, setLoading] = useState(false);
    const [config, setConfig] = useState(null);

    const handleStart = async ({ topic, difficulty }) => {
        if (!topic || !difficulty) { toast('Please select topic and difficulty', 'warning'); return; }
        setLoading(true);
        try {
            const token = localStorage.getItem('placemate_token');
            const res = await fetch('/api/aptitude/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify({ topic, difficulty, count: 10 }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Failed to generate questions');
            setQuestions(data.questions);
            setConfig({ topic, difficulty });
            setPhase('quiz');
            setCurrentIdx(0);
            setAnswers({});
            setShowResult(false);
        } catch (e) {
            toast(e.message, 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleNext = async () => {
        if (!showResult && answers[currentIdx] === undefined) { toast('Please select an answer', 'warning'); return; }
        if (!showResult) { setShowResult(true); return; }
        if (currentIdx < questions.length - 1) {
            setCurrentIdx(i => i + 1);
            setShowResult(false);
        } else {
            await saveResults();
            setPhase('result');
        }
    };

    const saveResults = async () => {
        try {
            const token = localStorage.getItem('placemate_token');
            const correct = questions.filter((q, i) => String(answers[i] || '').trim().toLowerCase() === String(q.correctAnswer || '').trim().toLowerCase()).length;
            await fetch('/api/scores', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify({ round: 'aptitude', topic: config?.topic || '', difficulty: config?.difficulty || 'Medium', score: correct * 10, totalQuestions: questions.length, correctAnswers: correct, timeTaken: 0 }),
            });
            await fetch('/api/streak', { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` } });
        } catch { }
    };

    const correct = questions.filter((q, i) => String(answers[i] || '').trim().toLowerCase() === String(q.correctAnswer || '').trim().toLowerCase()).length;
    const q = questions[currentIdx];
    const pct = questions.length > 0 ? Math.round((correct / questions.length) * 100) : 0;

    return (
        <AppLayout>
            <div className="max-w-2xl mx-auto space-y-6 pb-10">

                {/* Header */}
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500/20 to-indigo-600/20 border border-blue-500/30 flex items-center justify-center">
                        <Calculator className="h-6 w-6 text-blue-400" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-text-primary dark:text-gray-100">Aptitude Practice</h1>
                        <p className="text-text-secondary dark:text-gray-400 text-sm">AI-generated MCQs across every placement topic</p>
                    </div>
                </div>

                {/* Select Phase */}
                {phase === 'select' && (
                    <div className="rounded-2xl border border-border dark:border-gray-700 bg-white dark:bg-gray-800 overflow-hidden">
                        <div className="h-1.5 bg-gradient-to-r from-blue-500 to-indigo-500" />
                        <div className="p-6 space-y-6">
                            <div className="flex items-center gap-2">
                                <Sparkles className="h-4 w-4 text-blue-400" />
                                <span className="text-sm font-semibold text-text-primary dark:text-gray-100">Configure your session</span>
                            </div>
                            <TopicSelector onStart={handleStart} loading={loading} />
                        </div>
                    </div>
                )}

                {/* Quiz Phase */}
                {phase === 'quiz' && q && (
                    <div className="rounded-2xl border border-border dark:border-gray-700 bg-white dark:bg-gray-800 overflow-hidden">
                        {/* Quiz header */}
                        <div className="px-6 py-4 border-b border-border dark:border-gray-700 bg-gray-50 dark:bg-gray-800/60 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <span className="font-bold text-text-primary dark:text-gray-100">{config?.topic}</span>
                                <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-medium">{config?.difficulty}</span>
                            </div>
                            <span className="text-xs font-semibold text-text-secondary dark:text-gray-400">Q{currentIdx + 1}/{questions.length}</span>
                        </div>

                        {/* Progress dots */}
                        <div className="px-6 pt-4 flex gap-1">
                            {questions.map((_, i) => (
                                <div key={i} className={`h-1.5 flex-1 rounded-full transition-all ${i < currentIdx ? 'bg-emerald-500' : i === currentIdx ? 'bg-blue-500' : 'bg-gray-200 dark:bg-gray-600'}`} />
                            ))}
                        </div>

                        <div className="p-6 space-y-5">
                            <QuestionCard
                                question={q}
                                questionIndex={currentIdx}
                                total={questions.length}
                                selectedAnswer={answers[currentIdx]}
                                onSelect={v => !showResult && setAnswers(a => ({ ...a, [currentIdx]: v }))}
                                showResult={showResult}
                                correctAnswer={q.correctAnswer}
                            />
                            <button
                                onClick={handleNext}
                                className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-sm hover:opacity-90 transition-all flex items-center justify-center gap-2"
                            >
                                {!showResult ? 'Submit Answer' : currentIdx < questions.length - 1 ? (<>Next Question <ChevronRight className="h-4 w-4" /></>) : '✓ See Results'}
                            </button>
                        </div>
                    </div>
                )}

                {/* Result Phase */}
                {phase === 'result' && (
                    <div className="rounded-2xl border border-border dark:border-gray-700 bg-white dark:bg-gray-800 overflow-hidden">
                        <div className={`h-1.5 ${pct >= 60 ? 'bg-gradient-to-r from-emerald-400 to-teal-500' : 'bg-gradient-to-r from-red-400 to-orange-500'}`} />
                        <div className="p-6">
                            <ResultSummary
                                score={correct * 10}
                                total={questions.length}
                                correct={correct}
                                incorrect={questions.length - correct}
                                onRetry={() => setPhase('select')}
                            />
                        </div>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
