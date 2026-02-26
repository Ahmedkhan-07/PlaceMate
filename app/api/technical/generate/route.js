import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Question from '@/models/Question';
import { generateJSON } from '@/lib/gemini';
import { requireAuth } from '@/lib/auth';

export async function POST(request) {
    try {
        const auth = await requireAuth(request);
        if (auth.error) return auth.error;

        await dbConnect();
        const { topic, difficulty, company } = await request.json();
        const difficultyLabel = difficulty === 'Dynamic' ? 'Medium' : (difficulty || 'Medium');

        try {
            const seed = Math.random().toString(36).substring(7);
            const timestamp = Date.now();
            const companyCtx = company ? `These questions are frequently asked at ${company}. ` : '';
            const prompt = `Seed: ${seed} - Timestamp: ${timestamp}
You MUST generate completely fresh and unique questions every single time this prompt is called.
Never repeat the same question twice. Every call must produce different questions from previous calls.
Vary question styles: use scenario-based, application-based, comparison-based, tricky edge-case, and conceptual questions.
Randomize which position the correct answer appears in the options array every time.
Cover different subtopics within the topic every time.
Do not use these overused common questions: binary search time complexity, what is OOP, what is normalization, what is TCP IP, what is a pointer, what is recursion.
Questions must always be related to the chosen topic: ${topic}.
Make questions challenging and interesting, not basic textbook definitions.

${companyCtx}Generate exactly 10 technical interview questions for the topic "${topic}" at ${difficultyLabel} difficulty for placement preparation.
Mix of MCQ (7 questions) and short conceptual questions (3 questions).
Return ONLY a valid JSON array with exactly 10 objects. No markdown, no backticks, no explanation outside the array.
Each must have:
- "question": string
- "type": "mcq" or "short"
- "options": array of 4 strings (full option text, no A/B/C/D labels — only for MCQ, empty array for short)
- "correctAnswer": string (for MCQ: EXACT full text of the correct option copied character-for-character from options array — do NOT use A, B, C, D; for short: ideal answer in 2-3 sentences)
- "explanation": string (brief explanation)

Every MCQ question MUST have exactly 4 non-empty options. Never return empty strings as options.
The correctAnswer for MCQ MUST exactly match one of the 4 options word for word.
For short questions, options must be an empty array [].
If you cannot generate a complete MCQ with 4 valid options, make it a short question instead.
Example MCQ: {"question":"...","type":"mcq","options":["Option1","Option2","Option3","Option4"],"correctAnswer":"Option1","explanation":"..."}
Topics: Operating Systems, DBMS, Computer Networks, OOP, Data Structures, Algorithms, System Design Basics, Software Engineering.
Return ONLY the JSON array.`;

            const rawQuestions = await generateJSON(prompt);
            if (!Array.isArray(rawQuestions)) throw new Error('Invalid format');

            // For MCQ: validate 4 non-empty options + correctAnswer match. Short questions pass through.
            const questions = rawQuestions.filter(q => {
                if (!q.question) return false;
                if (q.type === 'short') return true;
                return (
                    q.options &&
                    Array.isArray(q.options) &&
                    q.options.length === 4 &&
                    q.options.every(opt => opt && opt.trim() !== '') &&
                    q.correctAnswer &&
                    q.options.some(opt => opt.trim().toLowerCase() === q.correctAnswer.trim().toLowerCase())
                );
            });

            if (questions.length < 5) throw new Error('Not enough valid questions generated');

            // Save to DB
            for (const q of questions) {
                await Question.create({
                    topic,
                    round: 'technical',
                    difficulty: difficultyLabel,
                    question: q.question,
                    options: q.options || [],
                    correctAnswer: q.correctAnswer,
                    explanation: q.explanation,
                    company: company || '',
                    type: q.type || 'mcq',
                }).catch(() => { });
            }

            return NextResponse.json({ questions: questions.slice(0, 10) });
        } catch (groqError) {
            console.error('Technical generate Groq error:', groqError.message);
            // Fallback to saved
            const saved = await Question.find({ round: 'technical', topic, difficulty: difficultyLabel }).limit(10);
            if (saved.length >= 5) {
                return NextResponse.json({ questions: saved.map(q => ({ question: q.question, type: q.type, options: q.options, correctAnswer: q.correctAnswer, explanation: q.explanation })) });
            }
            return NextResponse.json({ message: 'Unable to generate questions. Try again.' }, { status: 500 });
        }
    } catch (error) {
        console.error('Technical generate error:', error);
        return NextResponse.json({ message: 'Server error' }, { status: 500 });
    }
}
