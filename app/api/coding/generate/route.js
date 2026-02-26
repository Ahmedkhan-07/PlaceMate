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
        const { difficulty, topic, company } = await request.json();
        const difficultyLabel = difficulty === 'Dynamic' ? 'Medium' : (difficulty || 'Medium');

        try {
            const seed = Math.random().toString(36).substring(7);
            const timestamp = Date.now();
            const companyCtx = company ? `This is a commonly asked problem at ${company}. ` : '';
            const topicCtx = topic ? `Topic: ${topic}. ` : '';
            const prompt = `Seed: ${seed} - Timestamp: ${timestamp}
You MUST generate completely fresh and unique coding problems every single time this prompt is called.
Never repeat the same problem. Every call must produce different problems from previous calls.
Vary problem types: dynamic programming, graphs, trees, strings, arrays, math, greedy, backtracking.
Avoid overused problems: two sum, fibonacci, reverse a string, factorial, binary search.
Make problems genuinely challenging for placement interviews at top tech companies.

${companyCtx}${topicCtx}Generate 2 coding problems for placement preparation at ${difficultyLabel} difficulty.
Return ONLY a valid JSON array with exactly 2 objects. No markdown, no backticks, no explanation outside the array.
Each must have:
- "title": string
- "description": string (full problem description, 3-5 sentences)
- "examples": array of 2 objects each with "input", "output", "explanation"
- "constraints": array of 3-4 constraint strings
- "testCases": array of 5 objects each with "input" (string) and "output" (string)
- "difficulty": "${difficultyLabel}"
- "topic": string (e.g. "Arrays", "Strings", "Dynamic Programming", "Graph", "Tree")

Return ONLY the JSON array.`;

            const problems = await generateJSON(prompt);

            if (!Array.isArray(problems) || problems.length < 1) {
                throw new Error('Invalid format');
            }

            return NextResponse.json({ problems: problems.slice(0, 2) });
        } catch (err) {
            console.error('Coding generate Groq error:', err.message);
            // Provide fallback problems
            const fallback = [
                {
                    title: 'Two Sum',
                    description: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target. You may assume that each input would have exactly one solution, and you may not use the same element twice.',
                    examples: [
                        { input: 'nums = [2,7,11,15], target = 9', output: '[0,1]', explanation: 'nums[0] + nums[1] = 9' },
                        { input: 'nums = [3,2,4], target = 6', output: '[1,2]', explanation: 'nums[1] + nums[2] = 6' },
                    ],
                    constraints: ['2 <= nums.length <= 10^4', '-10^9 <= nums[i] <= 10^9', '-10^9 <= target <= 10^9', 'Only one valid answer exists'],
                    testCases: [
                        { input: '[2,7,11,15]\n9', output: '[0, 1]' },
                        { input: '[3,2,4]\n6', output: '[1, 2]' },
                        { input: '[3,3]\n6', output: '[0, 1]' },
                        { input: '[1,2,3,4,5]\n9', output: '[3, 4]' },
                        { input: '[0,4,3,0]\n0', output: '[0, 3]' },
                    ],
                    difficulty: difficultyLabel,
                    topic: 'Arrays',
                },
            ];
            return NextResponse.json({ problems: fallback });
        }
    } catch (error) {
        console.error('Coding generate error:', error);
        return NextResponse.json({ message: 'Server error' }, { status: 500 });
    }
}
