'use client';
import { useEffect, useState } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import QuestionCard from '@/components/aptitude/QuestionCard';
import Card, { CardBody, CardHeader } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { useToast } from '@/context/ToastContext';
import { Calendar, CheckCircle } from 'lucide-react';
import { format } from 'date-fns';

export default function DailyChallengePage() {
    const toast = useToast();
    const [challenge, setChallenge] = useState(null);
    const [answer, setAnswer] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function load() {
            try {
                const token = localStorage.getItem('placemate_token');
                const res = await fetch('/api/daily-challenge', { headers: { Authorization: `Bearer ${token}` } });
                const data = await res.json();
                if (data.challenge) setChallenge(data.challenge);
            } catch (e) {
                toast.error('Failed to load challenge');
            } finally {
                setLoading(false);
            }
        }
        load();
    }, []);

    const submit = async () => {
        if (!answer) { toast.warning('Select an answer'); return; }
        setSubmitted(true);
        const isCorrect = answer?.trim().toLowerCase() === challenge.correctAnswer?.trim().toLowerCase();
        if (isCorrect) { toast.success('🎉 Correct!'); } else { toast.error(`Wrong. Answer was: ${challenge.correctAnswer}`); }
        try {
            const token = localStorage.getItem('placemate_token');
            await fetch('/api/scores', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify({ round: 'aptitude', topic: 'Daily Challenge', difficulty: 'Medium', score: isCorrect ? 10 : 0, totalQuestions: 1, correctAnswers: isCorrect ? 1 : 0, timeTaken: 0 }),
            });
        } catch { }
    };

    return (
        <AppLayout>
            <div className="max-w-2xl mx-auto space-y-6">
                <div className="flex items-center gap-3">
                    <div>
                        <h1 className="text-2xl font-bold text-white">Daily Challenge</h1>
                        <p className="text-gray-500 text-sm flex items-center gap-1.5 mt-1">
                            <Calendar className="h-4 w-4" />
                            {format(new Date(), 'EEEE, MMMM d yyyy')}
                        </p>
                    </div>
                </div>

                {loading ? (
                    <div className="text-center py-20 text-gray-500">Loading today&apos;s challenge...</div>
                ) : !challenge ? (
                    <div className="text-center py-20 text-gray-500">No challenge available today. Check back later!</div>
                ) : (
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-semibold text-gray-800">{challenge.topic}</span>
                                {submitted && (
                                    <div className="flex items-center gap-1.5 text-emerald-400 text-sm">
                                        <CheckCircle className="h-4 w-4" /> Completed
                                    </div>
                                )}
                            </div>
                        </CardHeader>
                        <CardBody className="space-y-6">
                            <QuestionCard
                                question={challenge}
                                questionIndex={0}
                                total={1}
                                selectedAnswer={answer}
                                onSelect={setAnswer}
                                showResult={submitted}
                                correctAnswer={challenge.correctAnswer}
                            />
                            {!submitted && (
                                <Button onClick={submit} fullWidth disabled={!answer}>Submit Answer</Button>
                            )}
                        </CardBody>
                    </Card>
                )}
            </div>
        </AppLayout>
    );
}
