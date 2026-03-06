'use client';
import { useEffect, useState } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import QuestionCard from '@/components/aptitude/QuestionCard';
import { useToast } from '@/context/ToastContext';
import { Calendar, CheckCircle, XCircle, Flame } from 'lucide-react';
import { format } from 'date-fns';

export default function DailyChallengePage() {
    const toast = useToast();
    const [challenge, setChallenge] = useState(null);
    const [answer, setAnswer] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(true);
    const [isCorrect, setIsCorrect] = useState(null);

    useEffect(() => {
        async function load() {
            try {
                const token = localStorage.getItem('placemate_token');
                const res = await fetch('/api/daily-challenge', { headers: { Authorization: `Bearer ${token}` } });
                const data = await res.json();
                if (data.challenge) setChallenge(data.challenge);
            } catch {
                toast('Failed to load challenge', 'error');
            } finally {
                setLoading(false);
            }
        }
        load();
    }, []);

    const submit = async () => {
        if (!answer) { toast('Select an answer first', 'warning'); return; }
        const correct = answer?.trim().toLowerCase() === challenge.correctAnswer?.trim().toLowerCase();
        setIsCorrect(correct);
        setSubmitted(true);
        try {
            const token = localStorage.getItem('placemate_token');
            await fetch('/api/scores', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify({ round: 'aptitude', topic: 'Daily Challenge', difficulty: 'Medium', score: correct ? 10 : 0, totalQuestions: 1, correctAnswers: correct ? 1 : 0, timeTaken: 0 }),
            });
        } catch { }
    };

    return (
        <AppLayout>
            <div className="max-w-2xl mx-auto space-y-6 pb-10">

                {/* Header */}
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-rose-500/20 to-orange-600/20 border border-rose-500/30 flex items-center justify-center">
                        <Flame className="h-6 w-6 text-rose-400" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-text-primary dark:text-gray-100">Daily Challenge</h1>
                        <p className="text-text-secondary dark:text-gray-400 text-sm flex items-center gap-1.5">
                            <Calendar className="h-3.5 w-3.5" />
                            {format(new Date(), 'EEEE, MMMM d yyyy')}
                        </p>
                    </div>
                </div>

                {/* Loading */}
                {loading && (
                    <div className="rounded-2xl border border-border dark:border-gray-700 bg-white dark:bg-gray-800 p-16 text-center">
                        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                        <p className="text-text-secondary dark:text-gray-400 text-sm">Loading today&apos;s challenge...</p>
                    </div>
                )}

                {/* No challenge */}
                {!loading && !challenge && (
                    <div className="rounded-2xl border border-border dark:border-gray-700 bg-white dark:bg-gray-800 p-16 text-center space-y-2">
                        <p className="text-4xl">📅</p>
                        <p className="font-semibold text-text-primary dark:text-gray-100">No challenge today</p>
                        <p className="text-sm text-text-secondary dark:text-gray-400">Check back later!</p>
                    </div>
                )}

                {/* Challenge */}
                {!loading && challenge && (
                    <>
                        {/* Result banner */}
                        {submitted && (
                            <div className={`rounded-2xl border-2 p-5 flex items-center gap-4 ${isCorrect ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-400/50' : 'bg-red-50 dark:bg-red-900/20 border-red-400/50'}`}>
                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${isCorrect ? 'bg-emerald-500/20' : 'bg-red-500/20'}`}>
                                    {isCorrect ? <CheckCircle className="h-7 w-7 text-emerald-400" /> : <XCircle className="h-7 w-7 text-red-400" />}
                                </div>
                                <div>
                                    <p className={`font-bold text-lg ${isCorrect ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
                                        {isCorrect ? '🎉 Correct! Great job!' : '❌ Incorrect'}
                                    </p>
                                    {!isCorrect && <p className="text-sm text-text-secondary dark:text-gray-300">Correct answer: <span className="font-semibold text-emerald-600 dark:text-emerald-400">{challenge.correctAnswer}</span></p>}
                                </div>
                            </div>
                        )}

                        <div className="rounded-2xl border border-border dark:border-gray-700 bg-white dark:bg-gray-800 overflow-hidden">
                            {/* Card header */}
                            <div className="px-6 py-4 border-b border-border dark:border-gray-700 bg-gray-50 dark:bg-gray-800/60 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <span className="text-xs px-2.5 py-1 rounded-full bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 font-medium">{challenge.topic || 'Aptitude'}</span>
                                    <span className="text-xs px-2.5 py-1 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 font-medium">Medium</span>
                                </div>
                                {submitted && (
                                    <div className={`flex items-center gap-1 text-xs font-semibold ${isCorrect ? 'text-emerald-500' : 'text-red-500'}`}>
                                        <CheckCircle className="h-3.5 w-3.5" /> Completed
                                    </div>
                                )}
                            </div>
                            <div className="p-6 space-y-5">
                                <QuestionCard
                                    question={challenge}
                                    questionIndex={0}
                                    total={1}
                                    selectedAnswer={answer}
                                    onSelect={v => !submitted && setAnswer(v)}
                                    showResult={submitted}
                                    correctAnswer={challenge.correctAnswer}
                                />
                                {!submitted && (
                                    <button
                                        onClick={submit}
                                        disabled={!answer}
                                        className="w-full py-3 rounded-xl bg-gradient-to-r from-rose-500 to-orange-500 text-white font-bold text-sm hover:opacity-90 transition-all disabled:opacity-50 shadow-lg"
                                    >
                                        Submit Answer
                                    </button>
                                )}
                            </div>
                        </div>
                    </>
                )}
            </div>
        </AppLayout>
    );
}
