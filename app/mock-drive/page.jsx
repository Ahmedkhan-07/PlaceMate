'use client';
import { useState } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import RoundCard from '@/components/mock-drive/RoundCard';
import DriveProgress from '@/components/mock-drive/DriveProgress';
import ResultModal from '@/components/mock-drive/ResultModal';
import QuestionCard from '@/components/aptitude/QuestionCard';
import TechnicalQuestionCard from '@/components/technical/QuestionCard';
import Button from '@/components/ui/Button';
import Card, { CardBody } from '@/components/ui/Card';
import TimerBar from '@/components/aptitude/TimerBar';
import { useToast } from '@/context/ToastContext';
import { Target } from 'lucide-react';

const ROUNDS = [
    { type: 'aptitude', questions: 10, duration: 15 },
    { type: 'technical', questions: 10, duration: 15 },
    { type: 'coding', questions: 5, duration: 20 },
];

export default function MockDrivePage() {
    const toast = useToast();
    const [phase, setPhase] = useState('setup'); // setup | round | result
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
            setPhase('setup');
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
            const token = localStorage.getItem('placemate_token');
            const endpoint = round.type === 'aptitude'
                ? '/api/aptitude/generate'
                : round.type === 'technical'
                    ? '/api/technical/generate'
                    : '/api/coding/generate';
            const body = round.type === 'coding'
                ? { count: round.questions, difficulty: 'medium' }
                : { count: round.questions, topic: 'General', difficulty: 'medium', category: 'DSA' };
            const res = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify(body),
            });
            const data = await res.json();
            const qs = data.questions || data.problems || [];
            setQuestions(qs);
            setCurrentQ(0);
            setAnswers({});
            setShowAnswer(false);
            setCurrentRound(roundIdx);
            setPhase('round');
        } catch (e) {
            toast.error(e.message);
        } finally {
            setLoading(false);
        }
    };

    const handleRoundNext = async () => {
        if (!showAnswer) { setShowAnswer(true); return; }
        if (currentQ < questions.length - 1) {
            setCurrentQ(i => i + 1);
            setShowAnswer(false);
        } else {
            // Finish round
            const correct = questions.filter((q, i) => answers[i]?.trim().toLowerCase() === q.correctAnswer?.trim().toLowerCase()).length;
            const pct = Math.round((correct / questions.length) * 100);
            const newScores = { ...roundScores, [ROUNDS[currentRound].type]: pct };
            setRoundScores(newScores);

            const newStatuses = [...roundStatuses];
            newStatuses[currentRound] = 'completed';
            if (currentRound + 1 < ROUNDS.length) newStatuses[currentRound + 1] = 'active';
            setRoundStatuses(newStatuses);
            setPhase('setup');

            if (currentRound === ROUNDS.length - 1) {
                // Submit drive
                try {
                    const token = localStorage.getItem('placemate_token');
                    // Convert percentages to correct counts for the submit API
                    const aptitudeCorrect = Math.round(((newScores.aptitude || 0) / 100) * 10);
                    const codingPassed = Math.round(((newScores.coding || 0) / 100) * 2);
                    const technicalCorrect = Math.round(((newScores.technical || 0) / 100) * 10);
                    const res = await fetch('/api/mock-drive/submit', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                        body: JSON.stringify({
                            driveId: drive?.driveId || drive?._id,
                            aptitudeCorrect,
                            codingPassed,
                            technicalCorrect,
                        }),
                    });
                    const data = await res.json();
                    setFinalResult(data);
                    setShowResult(true);
                } catch (e) {
                    toast.error('Failed to submit drive');
                }
            }
        }
    };

    const round = ROUNDS[currentRound];
    const q = questions[currentQ];

    return (
        <AppLayout>
            <div className="max-w-2xl mx-auto space-y-6">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-sky-500/20 flex items-center justify-center">
                        <Target className="h-5 w-5 text-sky-400" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-white">Mock Drive</h1>
                        <p className="text-gray-500 text-sm">Simulate a full placement round</p>
                    </div>
                </div>

                {phase === 'setup' && (
                    <div className="space-y-4">
                        {drive && (
                            <DriveProgress
                                rounds={ROUNDS.map(r => r.type)}
                                current={roundStatuses.filter(s => s === 'completed').length}
                            />
                        )}
                        {!drive ? (
                            <Card>
                                <CardBody className="text-center py-8 space-y-4">
                                    <p className="text-gray-700">Complete 3 rounds: Aptitude → Technical → Coding</p>
                                    <p className="text-sm text-gray-400">Pass all rounds with 60%+ to earn a certificate</p>
                                    <Button onClick={startDrive} loading={loading} fullWidth>Start Mock Drive</Button>
                                </CardBody>
                            </Card>
                        ) : (
                            <div className="space-y-3">
                                {ROUNDS.map((r, i) => (
                                    <RoundCard
                                        key={i}
                                        round={r}
                                        index={i}
                                        status={roundStatuses[i]}
                                        score={roundScores[r.type]}
                                        onStart={() => startRound(i)}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {phase === 'round' && q && (
                    <Card>
                        <CardBody className="space-y-6">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-semibold text-gray-700 capitalize">{round.type} Round</span>
                                <TimerBar duration={90} running={!showAnswer} key={currentQ} onExpire={() => setShowAnswer(true)} />
                            </div>
                            {round.type === 'technical' ? (
                                <TechnicalQuestionCard
                                    question={q}
                                    index={currentQ}
                                    total={questions.length}
                                    selectedAnswer={answers[currentQ]}
                                    onSelect={l => setAnswers(a => ({ ...a, [currentQ]: l }))}
                                    showResult={showAnswer}
                                />
                            ) : (
                                <QuestionCard
                                    question={q}
                                    questionIndex={currentQ}
                                    total={questions.length}
                                    selectedAnswer={answers[currentQ]}
                                    onSelect={l => setAnswers(a => ({ ...a, [currentQ]: l }))}
                                    showResult={showAnswer}
                                    correctAnswer={q.correctAnswer}
                                />
                            )}
                            <button
                                onClick={handleRoundNext}
                                className="w-full py-3 bg-sky-600 hover:bg-sky-700 text-white font-semibold rounded-xl transition-colors"
                            >
                                {!showAnswer ? 'Submit' : currentQ < questions.length - 1 ? 'Next Question' : 'Finish Round'}
                            </button>
                        </CardBody>
                    </Card>
                )}

                <ResultModal
                    isOpen={showResult}
                    onClose={() => setShowResult(false)}
                    result={finalResult}
                    onRetry={() => {
                        setDrive(null);
                        setRoundStatuses(['active', 'locked', 'locked']);
                        setRoundScores({});
                        setShowResult(false);
                    }}
                />
            </div>
        </AppLayout>
    );
}
