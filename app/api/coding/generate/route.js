import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { generateContent, parseJSON } from '@/lib/gemini';
import { requireAuth } from '@/lib/auth';

export async function POST(request) {
    try {
        const auth = await requireAuth(request);
        if (auth.error) return auth.error;

        await dbConnect();
        const { difficulty, topic, company } = await request.json();
        const difficultyLabel = difficulty === 'dynamic' ? 'Medium' : (difficulty || 'Medium');

        try {
            const seed = Math.random().toString(36).substring(7);
            const timestamp = Date.now();
            const companyCtx = company ? `This is a commonly asked problem at ${company}. ` : '';
            const topicCtx = topic ? `Topic: ${topic}. ` : '';

            const prompt = `Seed: ${seed} Timestamp: ${timestamp}
${companyCtx}${topicCtx}Generate a unique coding problem for placement preparation with difficulty "${difficultyLabel}".
Return ONLY a valid JSON object. No markdown, no backticks, no explanation outside the JSON.

The problem must follow this exact format:
{
  "title": "Problem title here",
  "topic": "Arrays/Strings/Math/Trees/Graph/DP etc",
  "difficulty": "${difficultyLabel}",
  "description": "Clear problem description here. Explain exactly how input is provided via stdin.",
  "examples": [
    { "input": "example input", "output": "example output", "explanation": "why this output" }
  ],
  "constraints": ["constraint 1", "constraint 2"],
  "testCases": [
    { "input": "test input 1", "output": "expected output 1" },
    { "input": "test input 2", "output": "expected output 2" },
    { "input": "test input 3", "output": "expected output 3" },
    { "input": "test input 4", "output": "expected output 4" },
    { "input": "test input 5", "output": "expected output 5" }
  ]
}

STRICT RULES:
1. Always generate exactly 5 test cases minimum
2. Every test case must have completely different inputs
3. Every test case must produce a different output value
4. Make it impossible to hardcode answers — all 5 outputs MUST be different values
5. Test cases must cover: normal case, edge case, large input, small input, boundary case
6. Input format must be consistent and clear
7. Output must be a single line value that can be compared exactly
8. Never generate test cases where all outputs are the same
9. Never repeat the same problem
10. Clearly state in description how input is provided via stdin`;

            const text = await generateContent(prompt);
            const parsed = parseJSON(text);

            if (!parsed || typeof parsed !== 'object' || !parsed.testCases) {
                throw new Error('Invalid format from AI');
            }

            if (parsed.testCases.length < 3) {
                throw new Error('Not enough test cases generated');
            }

            const outputs = parsed.testCases.map(tc => tc.output);
            const uniqueOutputs = new Set(outputs);
            if (uniqueOutputs.size === 1) {
                throw new Error('All test cases have same output — rejecting');
            }

            const inputs = parsed.testCases.map(tc => tc.input);
            const uniqueInputs = new Set(inputs);
            if (uniqueInputs.size === 1) {
                throw new Error('All test cases have same input — rejecting');
            }

            return NextResponse.json({ success: true, problem: parsed, problems: [parsed] });

        } catch (err) {
            console.error('Coding generate AI error:', err.message);
            // Fallback problem with diverse test cases
            const fallback = {
                title: 'Count Character Occurrences',
                topic: 'Strings',
                difficulty: difficultyLabel,
                description: 'Given a string on line 1 and a character on line 2 via stdin, count how many times that character appears in the string. Output a single integer.',
                examples: [
                    { input: 'hello\nl', output: '2', explanation: "'l' appears twice in 'hello'" },
                    { input: 'banana\na', output: '3', explanation: "'a' appears 3 times in 'banana'" },
                ],
                constraints: ['1 <= string length <= 1000', 'character is a single lowercase letter'],
                testCases: [
                    { input: 'hello\nl', output: '2' },
                    { input: 'banana\na', output: '3' },
                    { input: 'mississippi\ns', output: '4' },
                    { input: 'abcdefg\nz', output: '0' },
                    { input: 'aaaaaa\na', output: '6' },
                ],
            };
            return NextResponse.json({ success: true, problem: fallback, problems: [fallback] });
        }
    } catch (error) {
        console.error('Coding generate error:', error);
        return NextResponse.json({ message: 'Server error' }, { status: 500 });
    }
}
