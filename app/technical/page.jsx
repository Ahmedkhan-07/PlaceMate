'use client';
import { useState } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import TechnicalQuestionCard from '@/components/technical/QuestionCard';
import ResultPanel from '@/components/technical/ResultPanel';
import { Select } from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Card, { CardHeader, CardBody } from '@/components/ui/Card';
import { useToast } from '@/context/ToastContext';
import { Wand2 } from 'lucide-react';

const CATEGORIES = ['DSA', 'DBMS', 'OS', 'OOP', 'CN', 'System Design', 'JavaScript', 'Python'];

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
            toast.error(e.message);
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
            const correct = questions.filter((q, i) => answers[i]?.trim().toLowerCase() === q.correctAnswer?.trim().toLowerCase()).length;
            const pct = Math.round((correct / questions.length) * 100);
            await fetch('/api/scores', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify({ round: 'technical', topic: category, difficulty: 'Medium', score: correct * 10, totalQuestions: questions.length, correctAnswers: correct, timeTaken: 0 }),
            });
        } catch { }
    };

    const correct = questions.filter((q, i) => answers[i]?.trim().toLowerCase() === q.correctAnswer?.trim().toLowerCase()).length;

    return (
        <AppLayout>
            <div className="max-w-2xl mx-auto space-y-6">
                <div>
                    <h1 className="text-2xl font-bold text-white">Technical MCQs</h1>
                    <p className="text-gray-500 text-sm">CS fundamentals, interview-ready questions</p>
                </div>

                {phase === 'select' && (
                    <Card>
                        <CardBody className="space-y-4">
                            <Select label="Category" value={category} onChange={e => setCategory(e.target.value)}>
                                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                            </Select>
                            <Button onClick={generate} loading={loading} icon={Wand2} fullWidth>
                                Generate Questions
                            </Button>
                        </CardBody>
                    </Card>
                )}

                {phase === 'quiz' && questions[currentIdx] && (
                    <Card>
                        <CardBody className="space-y-6">
                            <TechnicalQuestionCard
                                question={questions[currentIdx]}
                                index={currentIdx}
                                total={questions.length}
                                selectedAnswer={answers[currentIdx]}
                                onSelect={l => setAnswers(a => ({ ...a, [currentIdx]: l }))}
                                showResult={showResult}
                            />
                            <button
                                onClick={handleNext}
                                className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold rounded-xl transition-colors"
                            >
                                {!showResult ? 'Submit' : currentIdx < questions.length - 1 ? 'Next' : 'View Results'}
                            </button>
                        </CardBody>
                    </Card>
                )}

                {phase === 'result' && (
                    <Card>
                        <CardBody>
                            <ResultPanel
                                score={correct * 10}
                                total={questions.length}
                                correct={correct}
                                incorrect={questions.length - correct}
                                onRetry={() => setPhase('select')}
                            />
                        </CardBody>
                    </Card>
                )}
            </div>
        </AppLayout>
    );
}
