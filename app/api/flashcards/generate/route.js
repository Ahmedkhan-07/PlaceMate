import { NextResponse } from 'next/server';
import { generateJSON } from '@/lib/gemini';
import { requireAuth } from '@/lib/auth';

export async function POST(request) {
    try {
        const auth = await requireAuth(request);
        if (auth.error) return auth.error;

        const { topic } = await request.json();
        if (!topic) return NextResponse.json({ message: 'Topic is required' }, { status: 400 });

        const seed = Math.random().toString(36).substring(7);
        const timestamp = Date.now();
        const prompt = `Seed: ${seed} - Timestamp: ${timestamp}
You MUST generate completely fresh and unique flashcards every single time this prompt is called.
Never repeat the same card twice. Every call must produce different cards from previous calls.
Cover different subtopics within the topic every time. Vary the type of cards: definitions, comparisons, examples, edge cases, and diagrams-in-words.
Do not use basic overused definitions. Make cards genuinely useful for interviews.
Topic is: ${topic}.

Generate exactly 20 flashcard pairs for the topic "${topic}" for placement preparation.
Topics include: OS (Operating Systems), DBMS (Database Management Systems), CN (Computer Networks), OOPs (Object Oriented Programming).
Return ONLY a valid JSON array with exactly 20 objects. No markdown, no backticks, no explanation outside the array.
Each must have:
- "front": string (concept name, question, or keyword — keep it short, max 15 words)
- "back": string (explanation/answer — 2-4 sentences, comprehensive but concise)

Return ONLY the JSON array.`;

        const cards = await generateJSON(prompt);
        if (!Array.isArray(cards)) {
            return NextResponse.json({ message: 'Failed to generate flashcards' }, { status: 500 });
        }

        return NextResponse.json({ cards: cards.slice(0, 20) });
    } catch (error) {
        console.error('Flashcard generate error:', error);
        return NextResponse.json({ message: 'Server error' }, { status: 500 });
    }
}
