'use client';
import { useState, useCallback } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import FlashCard from '@/components/flashcards/FlashCard';
import DeckControls from '@/components/flashcards/DeckControls';
import StudyProgress from '@/components/flashcards/StudyProgress';
import { useToast } from '@/context/ToastContext';
import { BookOpen, Shuffle, ChevronLeft, Sparkles } from 'lucide-react';

const TOPICS = [
    { id: 'DSA', icon: '🌲' }, { id: 'JavaScript', icon: '🟨' }, { id: 'Python', icon: '🐍' },
    { id: 'System Design', icon: '⚙️' }, { id: 'DBMS', icon: '🗄️' }, { id: 'OS', icon: '💻' },
    { id: 'OOP', icon: '🧩' }, { id: 'React', icon: '⚛️' }, { id: 'Node.js', icon: '🟩' },
];

export default function FlashcardsPage() {
    const toast = useToast();
    const [phase, setPhase] = useState('select');
    const [cards, setCards] = useState([]);
    const [current, setCurrent] = useState(0);
    const [topic, setTopic] = useState('DSA');
    const [loading, setLoading] = useState(false);

    const generate = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('placemate_token');
            const res = await fetch('/api/flashcards/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify({ topic, count: 15 }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Failed');
            setCards(data.cards || []);
            setCurrent(0);
            setPhase('study');
        } catch (e) {
            toast(e.message, 'error');
        } finally {
            setLoading(false);
        }
    };

    const shuffle = useCallback(() => {
        setCards(c => [...c].sort(() => Math.random() - 0.5));
        setCurrent(0);
    }, []);

    return (
        <AppLayout>
            <div className="max-w-xl mx-auto space-y-6 pb-10">

                {/* Header */}
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500/20 to-orange-600/20 border border-amber-500/30 flex items-center justify-center">
                        <BookOpen className="h-6 w-6 text-amber-400" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-text-primary dark:text-gray-100">Flashcards</h1>
                        <p className="text-text-secondary dark:text-gray-400 text-sm">AI-generated flip cards for active recall</p>
                    </div>
                </div>

                {/* Select Phase */}
                {phase === 'select' && (
                    <div className="rounded-2xl border border-border dark:border-gray-700 bg-white dark:bg-gray-800 overflow-hidden">
                        <div className="h-1.5 bg-gradient-to-r from-amber-400 to-orange-500" />
                        <div className="p-6 space-y-5">
                            <div className="flex items-center gap-2">
                                <Sparkles className="h-4 w-4 text-amber-400" />
                                <span className="text-sm font-semibold text-text-primary dark:text-gray-100">Pick a topic</span>
                            </div>
                            <div className="grid grid-cols-3 gap-2.5">
                                {TOPICS.map(t => (
                                    <button
                                        key={t.id}
                                        onClick={() => setTopic(t.id)}
                                        className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 transition-all text-xs font-medium
                                            ${topic === t.id ? 'border-amber-400 bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400' : 'border-border dark:border-gray-700 hover:border-amber-300 text-text-secondary dark:text-gray-400'}`}
                                    >
                                        <span className="text-xl">{t.icon}</span>
                                        {t.id}
                                    </button>
                                ))}
                            </div>
                            <button
                                onClick={generate}
                                disabled={loading}
                                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold text-sm hover:opacity-90 transition-all disabled:opacity-50 shadow-lg"
                            >
                                {loading ? '⚙️ Generating Deck...' : `✨ Generate ${topic} Deck`}
                            </button>
                        </div>
                    </div>
                )}

                {/* Study Phase */}
                {phase === 'study' && cards.length > 0 && (
                    <div className="space-y-4">
                        {/* Top bar */}
                        <div className="rounded-2xl border border-border dark:border-gray-700 bg-white dark:bg-gray-800 px-5 py-3.5 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <button onClick={() => setPhase('select')} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                                    <ChevronLeft className="h-4 w-4 text-text-secondary dark:text-gray-400" />
                                </button>
                                <span className="font-semibold text-sm text-text-primary dark:text-gray-100">{topic}</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="text-xs text-text-secondary dark:text-gray-400 font-medium">{current + 1} / {cards.length}</span>
                                <button onClick={shuffle} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-700 text-text-secondary dark:text-gray-300 text-xs font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                                    <Shuffle className="h-3.5 w-3.5" /> Shuffle
                                </button>
                            </div>
                        </div>

                        {/* Progress bar */}
                        <div className="w-full h-1.5 rounded-full bg-gray-100 dark:bg-gray-700">
                            <div className="h-1.5 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 transition-all duration-500" style={{ width: `${((current + 1) / cards.length) * 100}%` }} />
                        </div>

                        <FlashCard card={cards[current]} index={current} total={cards.length} />

                        <DeckControls
                            onPrev={() => setCurrent(i => Math.max(0, i - 1))}
                            onNext={() => setCurrent(i => Math.min(cards.length - 1, i + 1))}
                            onShuffle={shuffle}
                            canPrev={current > 0}
                            canNext={current < cards.length - 1}
                        />
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
