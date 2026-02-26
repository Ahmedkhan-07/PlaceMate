const PISTON_URL = process.env.PISTON_API_URL || 'https://emkc.org/api/v2/piston/execute';

const LANGUAGE_MAP = {
    python: { language: 'python', version: '3.10.0' },
    javascript: { language: 'javascript', version: '18.15.0' },
    java: { language: 'java', version: '15.0.2' },
    'c++': { language: 'c++', version: '10.2.0' },
    c: { language: 'c', version: '10.2.0' },
};

export async function executeCode(language, code, stdin = '') {
    const langConfig = LANGUAGE_MAP[language.toLowerCase()];
    if (!langConfig) {
        throw new Error(`Unsupported language: ${language}`);
    }

    const response = await fetch(PISTON_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            language: langConfig.language,
            version: langConfig.version,
            files: [{ content: code }],
            stdin,
        }),
    });

    if (!response.ok) {
        throw new Error(`Piston API error: ${response.status}`);
    }

    const data = await response.json();
    const run = data.run || {};

    return {
        stdout: run.stdout || '',
        stderr: run.stderr || '',
        exitCode: run.code ?? 0,
        output: run.output || '',
    };
}

export const SUPPORTED_LANGUAGES = Object.keys(LANGUAGE_MAP);
