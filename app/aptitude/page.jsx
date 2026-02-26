'use client';
import { useState, useCallback } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import QuestionCard from '@/components/aptitude/QuestionCard';
import TopicSelector from '@/components/aptitude/TopicSelector';
import ResultSummary from '@/components/aptitude/ResultSummary';
import TimerBar from '@/components/aptitude/TimerBar';
import Card, { CardBody, CardHeader } from '@/components/ui/Card';
import { useToast } from '@/context/ToastContext';

export default function AptitudePage() {
    const toast = useToast();
    const [phase, setPhase] = useState('select'); // select | quiz | result
    const [questions, setQuestions] = useState([]);
    const [currentIdx, setCurrentIdx] = useState(0);
    const [answers, setAnswers] = useState({});
    const [showResult, setShowResult] = useState(false);
    const [loading, setLoading] = useState(false);
    const [config, setConfig] = useState(null);

    const handleStart = async ({ topic, difficulty }) => {
        if (!topic || !difficulty) { toast.warning('Please select topic and difficulty'); return; }
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
            toast.error(e.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSelect = (letter) => {
        if (showResult) return;
        setAnswers(a => ({ ...a, [currentIdx]: letter }));
    };

    const handleNext = async () => {
        if (!showResult && answers[currentIdx] === undefined) {
            toast.warning('Please select an answer');
            return;
        }
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
            const correct = questions.filter((q, i) => answers[i]?.trim().toLowerCase() === q.correctAnswer?.trim().toLowerCase()).length;
            const pct = Math.round((correct / questions.length) * 100);
            await fetch('/api/scores', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify({ round: 'aptitude', topic: config?.topic || '', difficulty: config?.difficulty || 'Medium', score: correct * 10, totalQuestions: questions.length, correctAnswers: correct, timeTaken: 0 }),
            });
            await fetch('/api/streak', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
            });
        } catch (e) { /* silent */ }
    };

    const correct = questions.filter((q, i) => answers[i]?.trim().toLowerCase() === q.correctAnswer?.trim().toLowerCase()).length;
    const q = questions[currentIdx];

    return (
        <AppLayout>
            <div className="max-w-2xl mx-auto space-y-6">
                <div>
                    <h1 className="text-2xl font-bold text-white">Aptitude Practice</h1>
                    <p className="text-gray-500 text-sm mt-1">AI-generated MCQs across every topic</p>
                </div>

                <Card>
                    {phase === 'select' && (
                        <CardBody>
                            <TopicSelector onStart={handleStart} loading={loading} />
                        </CardBody>
                    )}

                    {phase === 'quiz' && q && (
                        <>
                            <CardHeader>
                                <TimerBar duration={30} onExpire={() => { if (!showResult) { setShowResult(true); } }} running={!showResult} key={currentIdx} />
                            </CardHeader>
                            <CardBody className="space-y-6">
                                <QuestionCard
                                    question={q}
                                    questionIndex={currentIdx}
                                    total={questions.length}
                                    selectedAnswer={answers[currentIdx]}
                                    onSelect={handleSelect}
                                    showResult={showResult}
                                    correctAnswer={q.correctAnswer}
                                />
                                <button
                                    onClick={handleNext}
                                    className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold rounded-xl transition-colors"
                                >
                                    {!showResult ? 'Submit Answer' : currentIdx < questions.length - 1 ? 'Next Question' : 'See Results'}
                                </button>
                            </CardBody>
                        </>
                    )}

                    {phase === 'result' && (
                        <CardBody>
                            <ResultSummary
                                score={correct * 10}
                                total={questions.length}
                                correct={correct}
                                incorrect={questions.length - correct}
                                onRetry={() => setPhase('select')}
                            />
                        </CardBody>
                    )}
                </Card>
            </div>
        </AppLayout>
    );
}
