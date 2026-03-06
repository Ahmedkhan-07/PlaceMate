import Groq from 'groq-sdk';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function generateContent(prompt, retries = 3) {
    for (let attempt = 1; attempt <= retries; attempt++) {
        try {
            const completion = await groq.chat.completions.create({
                messages: [{ role: 'user', content: prompt }],
                model: 'llama-3.3-70b-versatile',
                temperature: 0.7,
                max_tokens: 4096,
            });
            return completion.choices[0]?.message?.content || '';
        } catch (error) {
            console.error(`Groq attempt ${attempt} failed:`, error.message);
            if (attempt === retries) throw error;
            await new Promise((r) => setTimeout(r, 1000 * attempt));
        }
    }
}

export function parseJSON(text) {
    if (!text) throw new Error('Empty Groq response');

    // 1. Strip markdown fences
    let cleaned = text
        .replace(/```json\s*/gi, '')
        .replace(/```\s*/g, '')
        .trim();

    // 2. Direct parse
    try { return JSON.parse(cleaned); } catch { }

    // 3. Extract the first complete JSON array
    const arrStart = cleaned.indexOf('[');
    const arrEnd = cleaned.lastIndexOf(']');
    if (arrStart !== -1 && arrEnd > arrStart) {
        try { return JSON.parse(cleaned.slice(arrStart, arrEnd + 1)); } catch { }
    }

    // 4. Extract the first complete JSON object
    const objStart = cleaned.indexOf('{');
    const objEnd = cleaned.lastIndexOf('}');
    if (objStart !== -1 && objEnd > objStart) {
        try { return JSON.parse(cleaned.slice(objStart, objEnd + 1)); } catch { }
    }

    // 5. Try fixing truncated arrays — find all complete objects inside
    const objectPattern = /\{[^{}]*\}/g;
    const matches = cleaned.match(objectPattern);
    if (matches && matches.length > 0) {
        const reconstructed = '[' + matches.join(',') + ']';
        try { return JSON.parse(reconstructed); } catch { }
    }

    throw new Error('Failed to parse Groq JSON response');
}

export async function generateJSON(prompt, retries = 3) {
    const text = await generateContent(prompt, retries);
    return parseJSON(text);
}
