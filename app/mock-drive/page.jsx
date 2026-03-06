'use client';
import { useState } from 'react';
import dynamic from 'next/dynamic';
import AppLayout from '@/components/layout/AppLayout';
import ResultModal from '@/components/mock-drive/ResultModal';
import QuestionCard from '@/components/aptitude/QuestionCard';
import TechnicalQuestionCard from '@/components/technical/QuestionCard';
import { useToast } from '@/context/ToastContext';
import { Target, CheckCircle, Lock, PlayCircle, Code2, Brain, Calculator, Trophy, ChevronRight } from 'lucide-react';

const MonacoEditor = dynamic(() => import('@monaco-editor/react'), { ssr: false });

const ROUNDS = [
    { type: 'aptitude', label: 'Aptitude', icon: Calculator, color: 'blue', questions: 10, desc: '10 MCQs covering reasoning, math & verbal' },
    { type: 'technical', label: 'Technical', icon: Brain, color: 'purple', questions: 10, desc: '10 questions on CS fundamentals & DSA' },
    { type: 'coding', label: 'Coding', icon: Code2, color: 'green', questions: 1, desc: '1 coding problem evaluated by Groq AI' },
];

const colorMap = {
    blue: { bg: 'bg-blue-500/10', icon: 'text-blue-400', border: 'border-blue-500/30', badge: 'bg-blue-500/20 text-blue-300' },
    purple: { bg: 'bg-purple-500/10', icon: 'text-purple-400', border: 'border-purple-500/30', badge: 'bg-purple-500/20 text-purple-300' },
    green: { bg: 'bg-emerald-500/10', icon: 'text-emerald-400', border: 'border-emerald-500/30', badge: 'bg-emerald-500/20 text-emerald-300' },
};

export default function MockDrivePage() {
    const toast = useToast();
    const [phase, setPhase] = useState('setup');
    const [drive, setDrive] = useState(null);
    const [currentRound, setCurrentRound] = useState(0);
    const [roundStatuses, setRoundStatuses] = useState(['active', 'locked', 'locked']);
    const [roundScores, setRoundScores] = useState({});
    const [questions, setQuestions] = useState([]);
    const [currentQ, setCurrentQ] = useState(0);
    const [answers, setAnswers] = useState({});
    const [showAnswer, setShowAnswer] = useState(false);
    const [showResult, setShowResult] = useState(false);
    const [finalResult, setFinalResult] = useState(null);
    const [loading, setLoading] = useState(false);

    // Coding state
    const [codingProblem, setCodingProblem] = useState(null);
    const [codingCode, setCodingCode] = useState('');
    const [codingLanguage, setCodingLanguage] = useState('python');
    const [codingEvaluation, setCodingEvaluation] = useState(null);
    const [evaluating, setEvaluating] = useState(false);

    const startDrive = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('placemate_token');
            const res = await fetch('/api/mock-drive/start', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify({ difficulty: 'Medium', company: 'General' }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Failed to start');
            setDrive(data);
        } catch (e) {
            toast(e.message, 'error');
        } finally {
            setLoading(false);
        }
    };

    const startRound = async (roundIdx) => {
        setLoading(true);
        const round = ROUNDS[roundIdx];
        try {
            if (round.type === 'coding') {
                const token = localStorage.getItem('placemate_token');
                const res = await fetch('/api/coding/generate', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                    body: JSON.stringify({ difficulty: 'medium', topic: 'random' }),
                });
                const data = await res.json();
                if (!data.success) throw new Error(data.message || 'Failed to generate coding problem');
                setCodingProblem(data.problem);
                setCodingCode(data.problem.starterCode?.python || '# Write your solution here');
                setCodingLanguage('python');
                setCodingEvaluation(null);
                setCurrentRound(roundIdx);
                setPhase('coding');
                return;
            }

            const token = localStorage.getItem('placemate_token');
            const endpoint = round.type === 'aptitude' ? '/api/aptitude/generate' : '/api/technical/generate';
            const res = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify({ count: round.questions, topic: 'General', difficulty: 'medium', category: 'DSA' }),
            });
            const data = await res.json();
            const qs = data.questions || data.problems || [];
            if (!qs.length) throw new Error('No questions returned');
            setQuestions(qs);
            setCurrentQ(0);
            setAnswers({});
            setShowAnswer(false);
            setCurrentRound(roundIdx);
            setPhase('round');
        } catch (e) {
            toast(e.message || 'Failed to start round', 'error');
        } finally {
            setLoading(false);
        }
    };

    const finishRound = async (newScores) => {
        const newStatuses = [...roundStatuses];
        newStatuses[currentRound] = 'completed';
        if (currentRound + 1 < ROUNDS.length) newStatuses[currentRound + 1] = 'active';
        setRoundStatuses(newStatuses);
        setPhase('setup');

        if (currentRound === ROUNDS.length - 1) {
            try {
                const token = localStorage.getItem('placemate_token');
                const aptitudeCorrect = Math.round(((newScores.aptitude || 0) / 100) * 10);
                const codingPassed = (newScores.coding || 0) >= 60 ? 1 : 0;
                const technicalCorrect = Math.round(((newScores.technical || 0) / 100) * 10);
                const res = await fetch('/api/mock-drive/submit', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                    body: JSON.stringify({ driveId: drive?.driveId || drive?._id, aptitudeCorrect, codingPassed, technicalCorrect }),
                });
                const data = await res.json();
                setFinalResult(data);
                setShowResult(true);
            } catch {
                toast('Failed to submit drive', 'error');
            }
        }
    };

    const handleRoundNext = async () => {
        if (!showAnswer) { setShowAnswer(true); return; }
        if (currentQ < questions.length - 1) {
            setCurrentQ(i => i + 1);
            setShowAnswer(false);
        } else {
            const correct = questions.filter((q, i) => {
                if (q.type === 'short') return answers[i] && answers[i].trim().length > 10;
                return String(answers[i] || '').trim().toLowerCase() === String(q.correctAnswer || '').trim().toLowerCase();
            }).length;
            const pct = Math.round((correct / questions.length) * 100);
            const newScores = { ...roundScores, [ROUNDS[currentRound].type]: pct };
            setRoundScores(newScores);
            await finishRound(newScores);
        }
    };

    const handleCodingSubmit = async () => {
        if (!codingCode || codingCode.includes('# Write your')) { toast('Please write your solution first', 'error'); return; }
        try {
            setEvaluating(true);
            const token = localStorage.getItem('placemate_token');
            const res = await fetch('/api/coding/evaluate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify({ code: codingCode, language: codingLanguage, problem: codingProblem, difficulty: 'medium' }),
            });
            const data = await res.json();
            if (!data.success) throw new Error(data.message);
            setCodingEvaluation(data.evaluation);
        } catch (e) {
            toast(e.message, 'error');
        } finally {
            setEvaluating(false);
        }
    };

    const handleCodingFinish = async () => {
        const newScores = { ...roundScores, coding: codingEvaluation?.score || 0 };
        setRoundScores(newScores);
        await finishRound(newScores);
    };

    const handleDownloadCertificate = async () => {
        try {
            const token = localStorage.getItem('placemate_token');
            const res = await fetch('/api/certificate/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify({ driveId: finalResult?.driveId }),
            });
            const data = await res.json();
            if (data.certificate) {
                toast('Certificate generated!', 'success');
                setTimeout(() => window.location.href = '/certificates', 1200);
            } else {
                toast(data.message || 'Failed', 'error');
            }
        } catch {
            toast('Certificate generation failed', 'error');
        }
    };

    const completedCount = roundStatuses.filter(s => s === 'completed').length;
    const round = ROUNDS[currentRound];
    const q = questions[currentQ];

    return (
        <AppLayout>
            <div className="max-w-3xl mx-auto space-y-6 pb-10">

                {/* ── Header ── */}
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-sky-500/20 to-blue-600/20 border border-sky-500/30 flex items-center justify-center">
                        <Target className="h-6 w-6 text-sky-400" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-text-primary dark:text-gray-100">Mock Drive</h1>
                        <p className="text-text-secondary dark:text-gray-400 text-sm">Full placement simulation — Aptitude · Technical · Coding</p>
                    </div>
                </div>

                {/* ── Setup Phase ── */}
                {phase === 'setup' && (
                    <>
                        {!drive ? (
                            /* Landing card */
                            <div className="rounded-2xl border border-border dark:border-gray-700 bg-white dark:bg-gray-800 overflow-hidden">
                                {/* Top gradient banner */}
                                <div className="h-2 bg-gradient-to-r from-blue-500 via-purple-500 to-emerald-500" />
                                <div className="p-8 space-y-6">
                                    <div className="text-center space-y-2">
                                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-sky-500/20 to-blue-600/20 border border-sky-500/30 flex items-center justify-center mx-auto mb-4">
                                            <Trophy className="h-8 w-8 text-amber-400" />
                                        </div>
                                        <h2 className="text-xl font-bold text-text-primary dark:text-gray-100">Ready for your Mock Drive?</h2>
                                        <p className="text-text-secondary dark:text-gray-400 text-sm max-w-md mx-auto">
                                            Complete all 3 rounds to earn a certificate. Score 60%+ overall to pass.
                                        </p>
                                    </div>

                                    {/* Round overview */}
                                    <div className="grid grid-cols-3 gap-3">
                                        {ROUNDS.map((r, i) => {
                                            const Icon = r.icon;
                                            const c = colorMap[r.color];
                                            return (
                                                <div key={i} className={`rounded-xl p-4 border ${c.bg} ${c.border} text-center space-y-2`}>
                                                    <div className={`w-9 h-9 rounded-lg ${c.bg} flex items-center justify-center mx-auto`}>
                                                        <Icon className={`h-5 w-5 ${c.icon}`} />
                                                    </div>
                                                    <p className="font-semibold text-sm text-text-primary dark:text-gray-100">{r.label}</p>
                                                    <p className="text-xs text-text-secondary dark:text-gray-400">{r.desc}</p>
                                                </div>
                                            );
                                        })}
                                    </div>

                                    <button
                                        onClick={startDrive}
                                        disabled={loading}
                                        className="w-full py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-base hover:opacity-90 transition-all disabled:opacity-50 shadow-lg"
                                    >
                                        {loading ? 'Preparing your drive...' : '🚀 Start Mock Drive'}
                                    </button>
                                </div>
                            </div>
                        ) : (
                            /* Round cards */
                            <div className="space-y-4">
                                {/* Progress header */}
                                <div className="rounded-2xl border border-border dark:border-gray-700 bg-white dark:bg-gray-800 p-5">
                                    <div className="flex items-center justify-between mb-3">
                                        <span className="text-sm font-semibold text-text-primary dark:text-gray-100">Overall Progress</span>
                                        <span className="text-sm font-bold text-primary">{completedCount}/{ROUNDS.length} Rounds</span>
                                    </div>
                                    <div className="w-full h-2.5 rounded-full bg-gray-100 dark:bg-gray-700">
                                        <div
                                            className="h-2.5 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-700"
                                            style={{ width: `${(completedCount / ROUNDS.length) * 100}%` }}
                                        />
                                    </div>
                                    <div className="flex justify-between mt-2">
                                        {ROUNDS.map((r, i) => (
                                            <span key={i} className={`text-xs font-medium ${roundStatuses[i] === 'completed' ? 'text-emerald-500' : roundStatuses[i] === 'active' ? 'text-primary' : 'text-gray-400'}`}>
                                                {r.label}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {/* Individual round cards */}
                                {ROUNDS.map((r, i) => {
                                    const Icon = r.icon;
                                    const status = roundStatuses[i];
                                    const score = roundScores[r.type];
                                    const c = colorMap[r.color];
                                    const isActive = status === 'active';
                                    const isDone = status === 'completed';
                                    const isLocked = status === 'locked';

                                    return (
                                        <div key={i} className={`rounded-2xl border bg-white dark:bg-gray-800 overflow-hidden transition-all ${isDone ? 'border-emerald-500/40' : isActive ? 'border-primary/40 shadow-md' : 'border-border dark:border-gray-700 opacity-60'}`}>
                                            <div className="p-5 flex items-center gap-4">
                                                <div className={`w-12 h-12 rounded-xl ${c.bg} border ${c.border} flex items-center justify-center shrink-0`}>
                                                    <Icon className={`h-6 w-6 ${c.icon}`} />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2 mb-0.5">
                                                        <span className="font-bold text-text-primary dark:text-gray-100">{r.label} Round</span>
                                                        {isDone && <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-medium">Completed</span>}
                                                        {isActive && <span className="text-xs px-2 py-0.5 rounded-full bg-primary/20 text-primary font-medium">Ready</span>}
                                                        {isLocked && <span className="text-xs px-2 py-0.5 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-500 font-medium">Locked</span>}
                                                    </div>
                                                    <p className="text-xs text-text-secondary dark:text-gray-400">{r.desc}</p>
                                                </div>
                                                <div className="shrink-0">
                                                    {isDone ? (
                                                        <div className="text-right">
                                                            <div className={`text-2xl font-bold ${score >= 60 ? 'text-emerald-400' : 'text-red-400'}`}>{score}%</div>
                                                            <CheckCircle className="h-5 w-5 text-emerald-400 ml-auto mt-0.5" />
                                                        </div>
                                                    ) : isLocked ? (
                                                        <Lock className="h-5 w-5 text-gray-400" />
                                                    ) : (
                                                        <button
                                                            onClick={() => startRound(i)}
                                                            disabled={loading}
                                                            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-semibold hover:opacity-90 transition-all disabled:opacity-50"
                                                        >
                                                            <PlayCircle className="h-4 w-4" />
                                                            {loading ? 'Loading...' : 'Start'}
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </>
                )}

                {/* ── MCQ Round (Aptitude / Technical) ── */}
                {phase === 'round' && q && (
                    <div className="rounded-2xl border border-border dark:border-gray-700 bg-white dark:bg-gray-800 overflow-hidden">
                        {/* Round header */}
                        <div className="px-6 py-4 border-b border-border dark:border-gray-700 flex items-center justify-between bg-gray-50 dark:bg-gray-800/60">
                            <div className="flex items-center gap-3">
                                <span className="font-bold text-text-primary dark:text-gray-100 capitalize">{round.type} Round</span>
                                <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">
                                    Q{currentQ + 1} / {questions.length}
                                </span>
                            </div>
                            {/* Progress dots */}
                            <div className="flex gap-1">
                                {questions.map((_, i) => (
                                    <div key={i} className={`h-1.5 w-4 rounded-full transition-all ${i < currentQ ? 'bg-emerald-500' : i === currentQ ? 'bg-primary' : 'bg-gray-200 dark:bg-gray-600'}`} />
                                ))}
                            </div>
                        </div>

                        <div className="p-6 space-y-5">
                            {round.type === 'technical' ? (
                                <TechnicalQuestionCard
                                    question={q}
                                    index={currentQ}
                                    total={questions.length}
                                    selectedAnswer={answers[currentQ]}
                                    onSelect={v => setAnswers(a => ({ ...a, [currentQ]: v }))}
                                    showResult={showAnswer}
                                />
                            ) : (
                                <QuestionCard
                                    question={q}
                                    questionIndex={currentQ}
                                    total={questions.length}
                                    selectedAnswer={answers[currentQ]}
                                    onSelect={v => setAnswers(a => ({ ...a, [currentQ]: v }))}
                                    showResult={showAnswer}
                                    correctAnswer={q.correctAnswer}
                                />
                            )}

                            <button
                                onClick={handleRoundNext}
                                className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-sm hover:opacity-90 transition-all flex items-center justify-center gap-2"
                            >
                                {!showAnswer ? 'Submit Answer' : currentQ < questions.length - 1 ? (<>Next Question <ChevronRight className="h-4 w-4" /></>) : '✓ Finish Round'}
                            </button>
                        </div>
                    </div>
                )}

                {/* ── Coding Round ── */}
                {phase === 'coding' && codingProblem && (
                    <div className="space-y-4">
                        {/* Problem */}
                        <div className="rounded-2xl border border-border dark:border-gray-700 bg-white dark:bg-gray-800 overflow-hidden">
                            <div className="h-1 bg-gradient-to-r from-emerald-400 to-teal-500" />
                            <div className="p-6 space-y-4">
                                <div className="flex items-start justify-between gap-3">
                                    <h2 className="text-lg font-bold text-text-primary dark:text-gray-100">{codingProblem.title}</h2>
                                    <div className="flex gap-2 shrink-0">
                                        <span className="text-xs px-2.5 py-1 rounded-full bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400 font-medium">{codingProblem.difficulty}</span>
                                        <span className="text-xs px-2.5 py-1 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 font-medium">{codingProblem.topic}</span>
                                    </div>
                                </div>
                                <p className="text-sm text-text-secondary dark:text-gray-300 leading-relaxed">{codingProblem.description}</p>
                                {codingProblem.examples?.[0] && (
                                    <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 font-mono text-sm space-y-1 border border-border dark:border-gray-600">
                                        <p className="text-text-primary dark:text-gray-200"><span className="font-sans font-semibold text-text-secondary dark:text-gray-400">Input: </span>{codingProblem.examples[0].input}</p>
                                        <p className="text-text-primary dark:text-gray-200"><span className="font-sans font-semibold text-text-secondary dark:text-gray-400">Output: </span>{codingProblem.examples[0].output}</p>
                                        {codingProblem.examples[0].explanation && <p className="font-sans text-xs text-text-secondary dark:text-gray-400 mt-1">{codingProblem.examples[0].explanation}</p>}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Language + Editor */}
                        <div className="rounded-2xl border border-border dark:border-gray-700 bg-white dark:bg-gray-800 overflow-hidden">
                            <div className="px-4 py-3 border-b border-border dark:border-gray-700 flex items-center gap-2 bg-gray-50 dark:bg-gray-800/60">
                                <Code2 className="h-4 w-4 text-emerald-400" />
                                <span className="text-xs font-semibold text-text-secondary dark:text-gray-400 mr-2">Language:</span>
                                {['python', 'javascript', 'java', 'cpp', 'c'].map(lang => (
                                    <button
                                        key={lang}
                                        onClick={() => { setCodingLanguage(lang); setCodingCode(codingProblem.starterCode?.[lang] || `# ${lang} solution`); }}
                                        className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${codingLanguage === lang ? 'bg-primary text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'}`}
                                    >
                                        {lang}
                                    </button>
                                ))}
                            </div>
                            <div style={{ height: '300px' }}>
                                <MonacoEditor
                                    height="300px"
                                    language={codingLanguage}
                                    value={codingCode}
                                    onChange={val => setCodingCode(val || '')}
                                    theme="vs-dark"
                                    options={{ fontSize: 14, minimap: { enabled: false }, scrollBeyondLastLine: false, wordWrap: 'on', lineNumbers: 'on', automaticLayout: true, tabSize: 4, padding: { top: 12 } }}
                                />
                            </div>
                        </div>

                        {/* Evaluation result */}
                        {codingEvaluation && (
                            <div className={`rounded-2xl border-2 p-5 space-y-3 ${codingEvaluation.isCorrect ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-400/50' : 'bg-red-50 dark:bg-red-900/20 border-red-400/50'}`}>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <span className="text-xl">{codingEvaluation.isCorrect ? '✅' : '❌'}</span>
                                        <span className="font-bold text-text-primary dark:text-gray-100">{codingEvaluation.verdict}</span>
                                    </div>
                                    <span className="text-3xl font-bold text-primary">{codingEvaluation.score}<span className="text-base text-text-secondary dark:text-gray-400">/100</span></span>
                                </div>
                                <p className="text-sm text-text-secondary dark:text-gray-300">{codingEvaluation.summary}</p>
                                <div className="grid grid-cols-2 gap-2">
                                    <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-2.5 border border-blue-200 dark:border-blue-700">
                                        <p className="text-xs text-blue-500 font-medium">Time</p>
                                        <p className="font-bold text-blue-700 dark:text-blue-300 text-sm">{codingEvaluation.timeComplexity}</p>
                                    </div>
                                    <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-2.5 border border-purple-200 dark:border-purple-700">
                                        <p className="text-xs text-purple-500 font-medium">Space</p>
                                        <p className="font-bold text-purple-700 dark:text-purple-300 text-sm">{codingEvaluation.spaceComplexity}</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Actions */}
                        <div className="flex gap-3">
                            {!codingEvaluation ? (
                                <button onClick={handleCodingSubmit} disabled={evaluating}
                                    className="flex-1 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold text-sm hover:opacity-90 disabled:opacity-50 transition-all shadow-lg"
                                >
                                    {evaluating ? '⚙️ Evaluating...' : '✔ Submit Solution'}
                                </button>
                            ) : (
                                <button onClick={handleCodingFinish}
                                    className="flex-1 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-sm hover:opacity-90 transition-all shadow-lg flex items-center justify-center gap-2"
                                >
                                    Finish & See Results <ChevronRight className="h-4 w-4" />
                                </button>
                            )}
                        </div>
                    </div>
                )}

                <ResultModal
                    isOpen={showResult}
                    onClose={() => setShowResult(false)}
                    result={finalResult}
                    onDownload={finalResult?.passed ? handleDownloadCertificate : undefined}
                    onRetry={() => {
                        setDrive(null); setRoundStatuses(['active', 'locked', 'locked']);
                        setRoundScores({}); setShowResult(false);
                        setCodingProblem(null); setCodingEvaluation(null);
                    }}
                />
            </div>
        </AppLayout>
    );
}
