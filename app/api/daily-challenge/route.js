import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import DailyChallenge from '@/models/DailyChallenge';
import { generateJSON } from '@/lib/gemini';
import { requireAuth } from '@/lib/auth';
import { format } from 'date-fns';

export async function GET(request) {
    try {
        const auth = await requireAuth(request);
        if (auth.error) return auth.error;

        await dbConnect();
        const today = format(new Date(), 'yyyy-MM-dd');

        let challenge = await DailyChallenge.findOne({ date: today });

        if (!challenge) {
            // Generate new challenge
            const rounds = ['aptitude', 'coding', 'technical'];
            const round = rounds[Math.floor(Math.random() * rounds.length)];

            try {
                const seed = Math.random().toString(36).substring(7);
                const timestamp = Date.now();
                const prompt = `Seed: ${seed} - Timestamp: ${timestamp}
You MUST generate a completely fresh and unique question every single time. Never repeat questions.
Make it challenging, scenario-based or application-based — not a basic definition.
Randomize which position the correct answer appears in the options array.
Do not use overused questions about: binary search, what is OOP, what is normalization, TCP/IP basics.

Generate 1 ${round} multiple-choice question for placement preparation at Medium difficulty.
Return ONLY a valid JSON object. No markdown, no backticks, no explanation outside the object.
The object must have:
- "question": string
- "options": array of exactly 4 strings (full option text, no A/B/C/D labels)
- "correctAnswer": string (EXACT full text of the correct option, copied character-for-character from the options array — do NOT use A, B, C, or D)
- "explanation": string
- "topic": string`;

                const q = await generateJSON(prompt);
                challenge = await DailyChallenge.create({
                    date: today,
                    round,
                    question: q.question,
                    options: q.options || [],
                    correctAnswer: q.correctAnswer,
                    explanation: q.explanation,
                    topic: q.topic || round,
                    difficulty: 'Medium',
                    completedBy: [],
                });
            } catch (err) {
                // Fallback
                challenge = await DailyChallenge.create({
                    date: today,
                    round: 'aptitude',
                    question: 'A train travels 300 km in 5 hours. What is the speed of the train?',
                    options: ['60 km/h', '50 km/h', '70 km/h', '55 km/h'],
                    correctAnswer: '60 km/h',
                    explanation: 'Speed = Distance / Time = 300 / 5 = 60 km/h',
                    topic: 'Time Speed Distance',
                    difficulty: 'Medium',
                    completedBy: [],
                });
            }
        }

        const userEntry = challenge.completedBy.find(
            (c) => c.userId.toString() === auth.userId.toString()
        );

        return NextResponse.json({
            challenge: {
                date: challenge.date,
                round: challenge.round,
                question: challenge.question,
                options: challenge.options,
                topic: challenge.topic,
                difficulty: challenge.difficulty,
                totalParticipants: challenge.completedBy.length,
            },
            userResult: userEntry ? {
                answer: userEntry.answer,
                isCorrect: userEntry.isCorrect,
                explanation: challenge.explanation,
                correctAnswer: challenge.correctAnswer,
            } : null,
        });
    } catch (error) {
        console.error('Daily challenge GET error:', error);
        return NextResponse.json({ message: 'Server error' }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        const auth = await requireAuth(request);
        if (auth.error) return auth.error;

        await dbConnect();
        const { answer } = await request.json();
        const today = format(new Date(), 'yyyy-MM-dd');

        const challenge = await DailyChallenge.findOne({ date: today });
        if (!challenge) return NextResponse.json({ message: 'No challenge for today' }, { status: 404 });

        const alreadyAnswered = challenge.completedBy.find(
            (c) => c.userId.toString() === auth.userId.toString()
        );
        if (alreadyAnswered) {
            return NextResponse.json({ message: 'Already answered today', result: alreadyAnswered });
        }

        const isCorrect = answer === challenge.correctAnswer;
        challenge.completedBy.push({ userId: auth.userId, answer, isCorrect, answeredAt: new Date() });
        await challenge.save();

        return NextResponse.json({
            isCorrect,
            correctAnswer: challenge.correctAnswer,
            explanation: challenge.explanation,
        });
    } catch (error) {
        return NextResponse.json({ message: 'Server error' }, { status: 500 });
    }
}
