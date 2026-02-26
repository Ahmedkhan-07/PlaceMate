import { NextResponse } from 'next/server';
import { executeCode } from '@/lib/piston';
import { requireAuth } from '@/lib/auth';

export async function POST(request) {
    try {
        const auth = await requireAuth(request);
        if (auth.error) return auth.error;

        const { language, code, stdin } = await request.json();

        if (!language || !code) {
            return NextResponse.json({ message: 'Language and code are required' }, { status: 400 });
        }

        const result = await executeCode(language, code, stdin || '');
        return NextResponse.json(result);
    } catch (error) {
        console.error('Code execute error:', error);
        return NextResponse.json({
            stdout: '',
            stderr: 'Execution failed. Please try again.',
            exitCode: 1,
            output: 'Execution failed. Please try again.',
        });
    }
}
