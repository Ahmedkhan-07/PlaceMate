'use client';
import { ChevronLeft, ChevronRight, Shuffle } from 'lucide-react';
import Button from '@/components/ui/Button';

export default function DeckControls({ onPrev, onNext, onShuffle, canPrev, canNext }) {
    return (
        <div className="flex items-center gap-3 justify-center">
            <Button variant="outline" size="sm" onClick={onPrev} disabled={!canPrev} icon={ChevronLeft}>
                Prev
            </Button>
            <Button variant="ghost" size="sm" onClick={onShuffle} icon={Shuffle}>
                Shuffle
            </Button>
            <Button variant="outline" size="sm" onClick={onNext} disabled={!canNext}>
                Next <ChevronRight className="h-4 w-4" />
            </Button>
        </div>
    );
}
