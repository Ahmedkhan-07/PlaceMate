import { generateContent } from '@/lib/gemini'
import connectDB from '@/lib/db'
import { verifyToken } from '@/lib/auth'

export async function POST(req) {
    try {
        await connectDB()

        const token = req.headers.get('authorization')?.replace('Bearer ', '')
        const decoded = verifyToken(token)
        if (!decoded) {
            return Response.json({ success: false, message: 'Unauthorized' }, { status: 401 })
        }

        const { code, language, problem, difficulty } = await req.json()

        if (!code || !problem) {
            return Response.json({ success: false, message: 'Code and problem required' }, { status: 400 })
        }

        const prompt = `You are an expert software engineer and coding interviewer evaluating a placement candidate's solution.

Problem Title: ${problem.title}
Problem Description: ${problem.description}
Difficulty: ${difficulty}
Language used: ${language}

Candidate's solution:
${code}

Evaluate this solution thoroughly and return ONLY a valid JSON object with no markdown no backticks no extra text:
{
  "isCorrect": true or false based on whether the logic correctly solves the problem,
  "score": a number between 0 and 100,
  "verdict": one of "Accepted" or "Wrong Answer" or "Syntax Error" or "Partial Solution" or "Time Limit Exceeded",
  "timeComplexity": "O(?) with brief explanation",
  "spaceComplexity": "O(?) with brief explanation",
  "strengths": ["what the candidate did well - at least 2 points"],
  "improvements": ["what could be improved - at least 2 points"],
  "optimalApproach": "explain the best possible approach to solve this problem with its time complexity",
  "optimalCode": "show the optimal ${language} solution in clean code",
  "syntaxErrors": "list any syntax or logical errors found line by line, or write None if no errors",
  "summary": "2-3 sentence overall assessment of the solution like a real interviewer would say"
}

Be fair but strict. If logic is correct but not optimal give score between 60-80. If logic is correct and optimal give 85-100. If syntax errors exist give below 40. If completely wrong give below 30. Award marks for correct approach even if minor mistakes exist.`

        const result = await generateContent(prompt)
        const cleaned = result.replace(/```json/g, '').replace(/```/g, '').trim()
        const evaluation = JSON.parse(cleaned)

        // save score
        await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/scores`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                round: 'coding',
                topic: problem.topic || 'General',
                difficulty,
                score: evaluation.score || 0,
                totalQuestions: 1,
                correctAnswers: evaluation.isCorrect ? 1 : 0
            })
        })

        // check badges
        await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/badges/check`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ round: 'coding', score: evaluation.score || 0 })
        })

        return Response.json({ success: true, evaluation }, { status: 200 })

    } catch (error) {
        console.error('Evaluate error:', error)
        return Response.json({ success: false, message: 'Evaluation failed: ' + error.message }, { status: 500 })
    }
}
