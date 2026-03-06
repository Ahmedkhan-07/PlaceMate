import { generateContent } from '@/lib/gemini'

export async function POST(req) {
    try {
        const { code, language, problem } = await req.json()

        if (!code || !problem) {
            return Response.json({ success: false, message: 'Code and problem required' }, { status: 400 })
        }

        const prompt = `You are a code executor. Given this coding problem and the user's code, simulate running the code and show what the output would be for the example inputs.

Problem: ${problem.title}
Description: ${problem.description}
Example Input: ${problem.examples?.[0]?.input || 'N/A'}
Expected Output: ${problem.examples?.[0]?.output || 'N/A'}

User's ${language} code:
\`\`\`${language}
${code}
\`\`\`

If the code has syntax errors point them out clearly.
If the code is correct show the simulated output for the example input.
If the code has logic errors explain what went wrong.
Keep response short and clear — max 6 lines.
Start with either "Output:" or "Error:" or "Syntax Error:"`

        const result = await generateContent(prompt)
        return Response.json({ success: true, output: result }, { status: 200 })

    } catch (error) {
        console.error('Run error:', error)
        return Response.json({ success: false, message: error.message }, { status: 500 })
    }
}
