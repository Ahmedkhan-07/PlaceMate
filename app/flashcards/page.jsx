'use client';
import { useState, useCallback } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import FlashCard from '@/components/flashcards/FlashCard';
import DeckControls from '@/components/flashcards/DeckControls';
import StudyProgress from '@/components/flashcards/StudyProgress';
import Button from '@/components/ui/Button';
import { Select } from '@/components/ui/Input';
import Card, { CardBody } from '@/components/ui/Card';
import { useToast } from '@/context/ToastContext';
import { Wand2 } from 'lucide-react';

const TOPICS = ['JavaScript', 'Python', 'DSA', 'System Design', 'DBMS', 'OS', 'OOP', 'React', 'Node.js'];

export default function FlashcardsPage() {
    const { toast } = useToast();
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
            <div className="max-w-xl mx-auto space-y-6">
                <div>
                    <h1 className="text-2xl font-bold text-white">Flashcards</h1>
                    <p className="text-gray-500 text-sm">AI-generated flip cards for active recall</p>
                </div>

                {phase === 'select' && (
                    <Card>
                        <CardBody className="space-y-4">
                            <Select label="Topic" value={topic} onChange={e => setTopic(e.target.value)}>
                                {TOPICS.map(t => <option key={t} value={t}>{t}</option>)}
                            </Select>
                            <Button onClick={generate} loading={loading} icon={Wand2} fullWidth>
                                Generate Deck
                            </Button>
                        </CardBody>
                    </Card>
                )}

                {phase === 'study' && cards.length > 0 && (
                    <div className="space-y-6">
                        <StudyProgress current={current + 1} total={cards.length} />
                        <FlashCard card={cards[current]} index={current} total={cards.length} />
                        <DeckControls
                            onPrev={() => setCurrent(i => Math.max(0, i - 1))}
                            onNext={() => setCurrent(i => Math.min(cards.length - 1, i + 1))}
                            onShuffle={shuffle}
                            canPrev={current > 0}
                            canNext={current < cards.length - 1}
                        />
                        <Button variant="ghost" onClick={() => setPhase('select')} fullWidth size="sm">
                            New Deck
                        </Button>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
