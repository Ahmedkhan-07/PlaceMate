'use client';
import { useState } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import TechnicalQuestionCard from '@/components/technical/QuestionCard';
import ResultPanel from '@/components/technical/ResultPanel';
import { useToast } from '@/context/ToastContext';
import { Brain, ChevronRight, Sparkles } from 'lucide-react';

const CATEGORIES = [
    { id: 'DSA', label: 'DSA', icon: '🌲', color: 'bg-blue-500/10 border-blue-500/30 text-blue-400' },
    { id: 'DBMS', label: 'DBMS', icon: '🗄️', color: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' },
    { id: 'OS', label: 'OS', icon: '💻', color: 'bg-purple-500/10 border-purple-500/30 text-purple-400' },
    { id: 'OOP', label: 'OOP', icon: '🧩', color: 'bg-amber-500/10 border-amber-500/30 text-amber-400' },
    { id: 'CN', label: 'Networks', icon: '🌐', color: 'bg-sky-500/10 border-sky-500/30 text-sky-400' },
    { id: 'System Design', label: 'System Design', icon: '⚙️', color: 'bg-rose-500/10 border-rose-500/30 text-rose-400' },
    { id: 'JavaScript', label: 'JavaScript', icon: '🟨', color: 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400' },
    { id: 'Python', label: 'Python', icon: '🐍', color: 'bg-teal-500/10 border-teal-500/30 text-teal-400' },
];

export default function TechnicalPage() {
    const toast = useToast();
    const [phase, setPhase] = useState('select');
    const [questions, setQuestions] = useState([]);
    const [currentIdx, setCurrentIdx] = useState(0);
    const [answers, setAnswers] = useState({});
    const [showResult, setShowResult] = useState(false);
    const [loading, setLoading] = useState(false);
    const [category, setCategory] = useState('DSA');

    const generate = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('placemate_token');
            const res = await fetch('/api/technical/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify({ topic: category, difficulty: 'Medium' }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Failed');
            setQuestions(data.questions);
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
        if (!showResult) { setShowResult(true); return; }
        if (currentIdx < questions.length - 1) {
            setCurrentIdx(i => i + 1);
            setShowResult(false);
        } else {
            await saveScore();
            setPhase('result');
        }
    };

    const saveScore = async () => {
        try {
            const token = localStorage.getItem('placemate_token');
            const correct = questions.filter((q, i) => String(answers[i] || '').trim().toLowerCase() === String(q.correctAnswer || '').trim().toLowerCase()).length;
            await fetch('/api/scores', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify({ round: 'technical', topic: category, difficulty: 'Medium', score: correct * 10, totalQuestions: questions.length, correctAnswers: correct, timeTaken: 0 }),
            });
        } catch { }
    };

    const correct = questions.filter((q, i) => String(answers[i] || '').trim().toLowerCase() === String(q.correctAnswer || '').trim().toLowerCase()).length;
    const selectedCat = CATEGORIES.find(c => c.id === category);

    return (
        <AppLayout>
            <div className="max-w-2xl mx-auto space-y-6 pb-10">

                {/* Header */}
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500/20 to-blue-600/20 border border-purple-500/30 flex items-center justify-center">
                        <Brain className="h-6 w-6 text-purple-400" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-text-primary dark:text-gray-100">Technical MCQs</h1>
                        <p className="text-text-secondary dark:text-gray-400 text-sm">CS fundamentals — DSA, OS, DBMS, OOP & more</p>
                    </div>
                </div>

                {/* Select Phase */}
                {phase === 'select' && (
                    <div className="rounded-2xl border border-border dark:border-gray-700 bg-white dark:bg-gray-800 overflow-hidden">
                        <div className="h-1.5 bg-gradient-to-r from-purple-500 to-blue-500" />
                        <div className="p-6 space-y-5">
                            <div className="flex items-center gap-2">
                                <Sparkles className="h-4 w-4 text-purple-400" />
                                <span className="text-sm font-semibold text-text-primary dark:text-gray-100">Choose a category</span>
                            </div>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                                {CATEGORIES.map(c => (
                                    <button
                                        key={c.id}
                                        onClick={() => setCategory(c.id)}
                                        className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 transition-all font-medium text-xs
                                            ${category === c.id ? 'border-primary bg-primary/10 text-primary' : 'border-border dark:border-gray-700 hover:border-primary/40 text-text-secondary dark:text-gray-400'}`}
                                    >
                                        <span className="text-xl">{c.icon}</span>
                                        {c.label}
                                    </button>
                                ))}
                            </div>
                            <button
                                onClick={generate}
                                disabled={loading}
                                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold text-sm hover:opacity-90 transition-all disabled:opacity-50 shadow-lg"
                            >
                                {loading ? '⚙️ Generating Questions...' : `✨ Generate ${category} Questions`}
                            </button>
                        </div>
                    </div>
                )}

                {/* Quiz Phase */}
                {phase === 'quiz' && questions[currentIdx] && (
                    <div className="rounded-2xl border border-border dark:border-gray-700 bg-white dark:bg-gray-800 overflow-hidden">
                        <div className="px-6 py-4 border-b border-border dark:border-gray-700 bg-gray-50 dark:bg-gray-800/60 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <span className="font-bold text-text-primary dark:text-gray-100">{category}</span>
                                <span className="text-xs px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 font-medium">Medium</span>
                            </div>
                            <span className="text-xs font-semibold text-text-secondary dark:text-gray-400">Q{currentIdx + 1}/{questions.length}</span>
                        </div>
                        <div className="px-6 pt-4 flex gap-1">
                            {questions.map((_, i) => (
                                <div key={i} className={`h-1.5 flex-1 rounded-full transition-all ${i < currentIdx ? 'bg-emerald-500' : i === currentIdx ? 'bg-purple-500' : 'bg-gray-200 dark:bg-gray-600'}`} />
                            ))}
                        </div>
                        <div className="p-6 space-y-5">
                            <TechnicalQuestionCard
                                question={questions[currentIdx]}
                                index={currentIdx}
                                total={questions.length}
                                selectedAnswer={answers[currentIdx]}
                                onSelect={v => setAnswers(a => ({ ...a, [currentIdx]: v }))}
                                showResult={showResult}
                            />
                            <button onClick={handleNext}
                                className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold text-sm hover:opacity-90 transition-all flex items-center justify-center gap-2">
                                {!showResult ? 'Submit Answer' : currentIdx < questions.length - 1 ? (<>Next Question <ChevronRight className="h-4 w-4" /></>) : '✓ View Results'}
                            </button>
                        </div>
                    </div>
                )}

                {/* Result Phase */}
                {phase === 'result' && (
                    <div className="rounded-2xl border border-border dark:border-gray-700 bg-white dark:bg-gray-800 overflow-hidden">
                        <div className={`h-1.5 ${correct / questions.length >= 0.6 ? 'bg-gradient-to-r from-emerald-400 to-teal-500' : 'bg-gradient-to-r from-red-400 to-orange-500'}`} />
                        <div className="p-6">
                            <ResultPanel score={correct * 10} total={questions.length} correct={correct} incorrect={questions.length - correct} onRetry={() => setPhase('select')} />
                        </div>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
