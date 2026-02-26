import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import MockDrive from '@/models/MockDrive';
import { generateJSON } from '@/lib/gemini';
import { requireAuth } from '@/lib/auth';

export async function POST(request) {
    try {
        const auth = await requireAuth(request);
        if (auth.error) return auth.error;

        await dbConnect();
        const { difficulty } = await request.json();

        const passingCriteria = { Easy: 60, Medium: 65, Hard: 75, Dynamic: 70 };

        // Generate all questions upfront
        let aptitudeQuestions = [], codingQuestions = [], technicalQuestions = [];
        const diff = difficulty === 'Dynamic' ? 'Medium' : difficulty;

        try {
            const seed = Math.random().toString(36).substring(7);
            const aptPrompt = `Seed: ${seed} - Generate 10 mixed aptitude MCQ questions at ${diff} difficulty for placement.
Return ONLY a valid JSON array of 10 objects. Each MUST have:
- "question": string
- "options": array of EXACTLY 4 non-empty strings (full text, no A/B/C/D labels)
- "correctAnswer": string (EXACT copy of one of the 4 options — must match word for word)
- "explanation": string
Every single question MUST have exactly 4 non-empty options. Never return empty strings as options.
The correctAnswer MUST exactly match one of the 4 options. If you cannot generate a complete question, skip it.
Return ONLY the JSON array.`;
            const rawApt = await generateJSON(aptPrompt);
            aptitudeQuestions = Array.isArray(rawApt) ? rawApt.filter(q =>
                q.question && q.options && Array.isArray(q.options) && q.options.length === 4 &&
                q.options.every(opt => opt && opt.trim() !== '') && q.correctAnswer &&
                q.options.some(opt => opt.trim().toLowerCase() === q.correctAnswer.trim().toLowerCase())
            ) : [];
            if (aptitudeQuestions.length < 1) throw new Error('No valid aptitude questions');
        } catch (e) {
            aptitudeQuestions = [{
                question: 'If 20% of a number is 80, what is the number?', options: ['400', '300', '500', '350'],
                correctAnswer: '400', explanation: '20% of 400 = 80'
            }];
        }

        try {
            const codePrompt = `Generate 2 coding problems at ${diff} difficulty suitable for placement.
Return ONLY a JSON array of 2 objects with: title, description, examples (array of {input,output,explanation}), constraints (array), testCases (array of {input,output}), topic.`;
            codingQuestions = await generateJSON(codePrompt);
        } catch (e) {
            codingQuestions = [{
                title: 'Reverse a String', description: 'Write a function to reverse a given string.',
                examples: [{ input: 'hello', output: 'olleh', explanation: 'Characters reversed' }],
                constraints: ['1 <= s.length <= 1000'],
                testCases: [{ input: 'hello', output: 'olleh' }, { input: 'world', output: 'dlrow' }],
                topic: 'Strings',
            }];
        }

        try {
            const seed2 = Math.random().toString(36).substring(7);
            const techPrompt = `Seed: ${seed2} - Generate 10 technical interview MCQ questions at ${diff} difficulty, mix of CS topics.
Return ONLY a valid JSON array of 10 objects. Each MUST have:
- "question": string
- "type": "mcq" or "short"
- "options": EXACTLY 4 non-empty strings for mcq, [] for short
- "correctAnswer": string (for MCQ: EXACT copy of one of the 4 options; for short: 2-3 sentence answer)
- "explanation": string
Every MCQ MUST have exactly 4 non-empty options. The correctAnswer must match one option exactly.
Return ONLY the JSON array.`;
            const rawTech = await generateJSON(techPrompt);
            technicalQuestions = Array.isArray(rawTech) ? rawTech.filter(q => {
                if (!q.question) return false;
                if (q.type === 'short') return true;
                return q.options && Array.isArray(q.options) && q.options.length === 4 &&
                    q.options.every(opt => opt && opt.trim() !== '') && q.correctAnswer &&
                    q.options.some(opt => opt.trim().toLowerCase() === q.correctAnswer.trim().toLowerCase());
            }) : [];
            if (technicalQuestions.length < 1) throw new Error('No valid technical questions');
        } catch (e) {
            technicalQuestions = [{
                question: 'What is a deadlock?', type: 'short', options: [],
                correctAnswer: 'A deadlock occurs when two or more processes are waiting indefinitely for resources held by each other.',
                explanation: 'Deadlocks involve circular resource dependencies.'
            }];
        }

        const drive = await MockDrive.create({
            userId: auth.userId,
            difficulty,
            status: 'aptitude',
            passingCriteria: passingCriteria[difficulty] || 60,
            aptitudeQuestions: aptitudeQuestions.slice(0, 10),
            codingQuestions: codingQuestions.slice(0, 2),
            technicalQuestions: technicalQuestions.slice(0, 10),
        });

        return NextResponse.json({
            driveId: drive._id,
            difficulty,
            passingCriteria: drive.passingCriteria,
            aptitudeQuestions: drive.aptitudeQuestions,
            codingQuestions: drive.codingQuestions,
            technicalQuestions: drive.technicalQuestions,
        }, { status: 201 });
    } catch (error) {
        console.error('Mock drive start error:', error);
        return NextResponse.json({ message: 'Server error' }, { status: 500 });
    }
}
