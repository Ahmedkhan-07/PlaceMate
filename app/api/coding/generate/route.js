import { generateContent } from '@/lib/gemini'
import connectDB from '@/lib/db'

export async function POST(req) {
    try {
        await connectDB()
        const { difficulty, topic } = await req.json()
        const seed = Math.random().toString(36).substring(7)
        const timestamp = Date.now()

        const prompt = `Seed: ${seed} Timestamp: ${timestamp}
Generate a unique coding problem for placement preparation with difficulty "${difficulty || 'medium'}".
Return ONLY a valid JSON object. No markdown, no backticks, no explanation outside JSON.

Return exactly this format:
{
  "title": "Problem title",
  "topic": "Arrays/Strings/Math/Trees/Graph/DP",
  "difficulty": "${difficulty || 'medium'}",
  "description": "Clear problem description. Explain what the function receives as parameters and what it should return.",
  "examples": [
    { "input": "nums = [2,7,11,15], target = 9", "output": "[0,1]", "explanation": "nums[0] + nums[1] = 9" }
  ],
  "constraints": ["1 <= nums.length <= 10^4", "All values are unique"],
  "starterCode": {
    "python": "def solve(param1, param2):\\n    # Write your code here\\n    pass",
    "javascript": "function solve(param1, param2) {\\n    // Write your code here\\n}",
    "java": "class Solution {\\n    public returnType solve(paramType param1) {\\n        // Write your code here\\n    }\\n}",
    "cpp": "class Solution {\\npublic:\\n    returnType solve(paramType param1) {\\n        // Write your code here\\n    }\\n};",
    "c": "returnType solve(paramType param1) {\\n    // Write your code here\\n}"
  },
  "driverCode": {
    "python": "# driver code that calls solve() with each test case and prints output",
    "javascript": "// driver code that calls solve() with each test case and logs output",
    "java": "// driver code with main method that calls solve() and prints output",
    "cpp": "// driver code with main() that calls solve() and prints output",
    "c": "// driver code with main() that calls solve() and prints output"
  },
  "testCases": [
    { "expectedOutput": "exact expected output as string" },
    { "expectedOutput": "exact expected output as string" },
    { "expectedOutput": "exact expected output as string" },
    { "expectedOutput": "exact expected output as string" },
    { "expectedOutput": "exact expected output as string" }
  ]
}

STRICT RULES:
1. starterCode must be a real function with correct parameter names and types matching the problem
2. driverCode must call the function with hardcoded test case values and print/console.log the result
3. Each language driverCode must be complete and runnable when appended to the starterCode
4. testCases expectedOutput must exactly match what the driverCode prints for each test case
5. Generate exactly 5 test cases with different inputs hardcoded in driverCode
6. driverCode for python must print each test case result on a new line
7. driverCode for javascript must console.log each test case result on a new line
8. driverCode for java must use System.out.println for each test case result
9. driverCode for cpp must use cout for each test case result
10. Never use stdin input() or Scanner — all inputs are hardcoded in driverCode
11. Make all 5 test cases have different inputs producing different outputs
12. The combined starterCode + driverCode must be valid runnable code
13. Use simple clear function names like twoSum, maxSubarray, reverseString etc
14. Generate completely unique problem every time — seed ${seed} ensures this

Example of correct python driverCode for twoSum:
"print(twoSum([2,7,11,15], 9))\\nprint(twoSum([3,2,4], 6))\\nprint(twoSum([3,3], 6))\\nprint(twoSum([1,2,3,4], 7))\\nprint(twoSum([0,4,3,0], 0))"

Example of correct testCases for above:
[
  {"expectedOutput": "[0, 1]"},
  {"expectedOutput": "[1, 2]"},
  {"expectedOutput": "[0, 1]"},
  {"expectedOutput": "[2, 3]"},
  {"expectedOutput": "[0, 3]"}
]`

        const text = await generateContent(prompt)
        const cleaned = text.replace(/```json/g, '').replace(/```/g, '').trim()
        const parsed = JSON.parse(cleaned)

        if (!parsed.starterCode || !parsed.driverCode || !parsed.testCases) {
            throw new Error('Invalid problem format generated')
        }

        if (parsed.testCases.length < 3) {
            throw new Error('Not enough test cases')
        }

        return Response.json({ success: true, problem: parsed }, { status: 200 })

    } catch (error) {
        console.error('Coding generate error:', error)
        return Response.json({ success: false, message: error.message }, { status: 500 })
    }
}
