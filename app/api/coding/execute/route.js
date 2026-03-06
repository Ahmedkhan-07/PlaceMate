export async function POST(req) {
    try {
        const { userCode, language, driverCode, stdin, code } = await req.json()

        if (!userCode || !language) {
            return Response.json({ success: false, message: 'Code and language required' }, { status: 400 })
        }

        const languageMap = {
            python: { lang: 'python3', ext: 'py' },
            javascript: { lang: 'javascript', ext: 'js' },
            java: { lang: 'java', ext: 'java' },
            cpp: { lang: 'cpp', ext: 'cpp' },
            c: { lang: 'c', ext: 'c' }
        }

        const selected = languageMap[language.toLowerCase()]
        if (!selected) {
            return Response.json({ success: false, message: 'Unsupported language' }, { status: 400 })
        }

        // combine user code with driver code
        const fullCode = `${userCode}\n\n${driverCode || ''}`

        const response = await fetch('https://emkc.org/api/v1/piston/execute', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                language: selected.lang,
                source: fullCode,
                stdin: stdin || ''
            })
        })

        if (!response.ok) {
            return Response.json({ success: false, message: 'Execution service unavailable' }, { status: 500 })
        }

        const result = await response.json()

        return Response.json({
            success: true,
            output: result.output || '',
            stdout: result.stdout || '',
            stderr: result.stderr || '',
            ran: result.ran,
            exitCode: result.ran ? 0 : 1
        }, { status: 200 })

    } catch (error) {
        console.error('Execute error:', error)
        return Response.json({ success: false, message: 'Execution failed' }, { status: 500 })
    }
}
