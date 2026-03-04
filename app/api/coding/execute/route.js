import { requireAuth } from '@/lib/auth';

const languageMap = {
    python: 'python3',
    javascript: 'javascript',
    java: 'java',
    'c++': 'cpp',
    c: 'c'
};

export async function POST(request) {
    try {
        const auth = await requireAuth(request);
        if (auth.error) return auth.error;

        const { language, code, stdin } = await request.json();

        if (!language || !code) {
            return Response.json({ success: false, message: 'Language and code are required' }, { status: 400 });
        }

        const lang = languageMap[language.toLowerCase()];
        if (!lang) {
            return Response.json({ success: false, message: 'Unsupported language' }, { status: 400 });
        }

        const response = await fetch('https://emkc.org/api/v1/piston/execute', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                language: lang,
                source: code,
                stdin: stdin || ''
            })
        });

        if (!response.ok) {
            return Response.json({ success: false, message: 'Code execution service unavailable' }, { status: 500 });
        }

        const result = await response.json();

        return Response.json({
            success: true,
            output: result.output || '',
            stdout: result.stdout || '',
            stderr: result.stderr || '',
            exitCode: result.ran ? 0 : 1
        }, { status: 200 });

    } catch (error) {
        console.error('Code execute error:', error);
        return Response.json({
            success: false,
            message: 'Execution failed. Please try again.',
            output: '',
            stderr: 'Execution failed. Please try again.',
            exitCode: 1,
        }, { status: 500 });
    }
}
