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

        if (!topic || !difficulty) {
            return NextResponse.json({ message: 'Topic and difficulty are required' }, { status: 400 });
        }

        const difficultyLabel = difficulty === 'Dynamic' ? 'Medium' : difficulty;

        let questions = [];

        try {
            const seed = Math.random().toString(36).substring(7);
            const timestamp = Date.now();
            const companyContext = company ? `These questions are commonly asked by ${company}. ` : '';
            const prompt = `Seed: ${seed} - Timestamp: ${timestamp}
You MUST generate completely fresh and unique questions every single time this prompt is called.
Never repeat the same question twice. Every call must produce different questions from previous calls.
Vary question styles: use scenario-based, application-based, comparison-based, tricky edge-case, and conceptual questions.
Randomize which position the correct answer appears in the options array every time.
Cover different subtopics within the topic every time.
Do not use these overused common questions: binary search time complexity, what is OOP, what is normalization, what is TCP IP, what is a pointer, what is recursion.
Questions must always be related to the chosen topic: ${topic}.
Make questions challenging and interesting, not basic textbook definitions.

${companyContext}Generate exactly 10 unique multiple-choice aptitude questions for the topic "${topic}" at ${difficultyLabel} difficulty level.
Return ONLY a valid JSON array with exactly 10 objects. No markdown, no backticks, no explanation outside the array.
Each object must have:
- "question": string (the question text)
- "options": array of exactly 4 strings (the full option text, no A/B/C/D labels)
- "correctAnswer": string (must be the EXACT full text of the correct option — copy it character-for-character from the options array. Do NOT use A, B, C, or D.)
- "explanation": string (brief explanation)

Example format:
[{"question":"What is 2+2?","options":["3","4","5","6"],"correctAnswer":"4","explanation":"2+2 equals 4"}]

Every single question MUST have exactly 4 non-empty options in the options array.
Never return a question without all 4 options filled. Never return an empty string as an option.
The correctAnswer MUST exactly match one of the 4 options word for word.
If you cannot generate a complete question with 4 options, skip it entirely.

Topics: Number System, Percentage, Profit & Loss, Time & Work, Time Speed Distance, Ratio & Proportion, Probability, Permutation & Combination, Logical Reasoning, Verbal Ability, Data Interpretation, Coding Decoding, Blood Relations, Seating Arrangement.
Return ONLY the JSON array.`;

            questions = await generateJSON(prompt);

            const validQuestions = questions.filter(q =>
                q.question &&
                q.options &&
                Array.isArray(q.options) &&
                q.options.length === 4 &&
                q.options.every(opt => opt && opt.trim() !== '') &&
                q.correctAnswer &&
                q.options.some(opt => opt.trim().toLowerCase() === q.correctAnswer.trim().toLowerCase())
            );

            if (validQuestions.length < 5) {
                throw new Error('Not enough valid questions generated');
            }
            questions = validQuestions;

            // Save to question bank
            for (const q of questions) {
                await Question.create({
                    topic,
                    round: 'aptitude',
                    difficulty: difficultyLabel,
                    question: q.question,
                    options: q.options,
                    correctAnswer: q.correctAnswer,
                    explanation: q.explanation,
                    company: company || '',
                    type: 'mcq',
                }).catch(() => { }); // Ignore duplicate errors
            }
        } catch (groqError) {
            console.error('Groq error, falling back to saved questions:', groqError.message);
            // Fallback to saved questions
            const saved = await Question.find({
                round: 'aptitude',
                difficulty: difficultyLabel,
                ...(topic && { topic }),
                ...(company && { company }),
            }).limit(20);

            if (saved.length >= 5) {
                // Pick 10 random
                const shuffled = saved.sort(() => Math.random() - 0.5).slice(0, 10);
                questions = shuffled.map(q => ({
                    question: q.question,
                    options: q.options,
                    correctAnswer: q.correctAnswer,
                    explanation: q.explanation,
                }));
            } else {
                return NextResponse.json({ message: 'Unable to generate questions. Please try again.' }, { status: 500 });
            }
        }

        return NextResponse.json({ questions: questions.slice(0, 10) });
    } catch (error) {
        console.error('Aptitude generate error:', error);
        return NextResponse.json({ message: 'Server error' }, { status: 500 });
    }
}
