import Groq from 'groq-sdk';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function generateContent(prompt, retries = 3) {
    for (let attempt = 1; attempt <= retries; attempt++) {
        try {
            const completion = await groq.chat.completions.create({
                messages: [{ role: 'user', content: prompt }],
                model: 'llama-3.3-70b-versatile',
                temperature: 0.7,
                max_tokens: 2048,
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
    try {
        // Strip markdown code blocks if present
        const cleaned = text
            .replace(/```json\n?/g, '')
            .replace(/```\n?/g, '')
            .trim();
        return JSON.parse(cleaned);
    } catch {
        // Try to extract JSON array or object from text
        const arrayMatch = text.match(/\[[\s\S]*\]/);
        if (arrayMatch) {
            try { return JSON.parse(arrayMatch[0]); } catch { }
        }
        const objMatch = text.match(/\{[\s\S]*\}/);
        if (objMatch) {
            try { return JSON.parse(objMatch[0]); } catch { }
        }
        throw new Error('Failed to parse Groq JSON response');
    }
}

export async function generateJSON(prompt, retries = 3) {
    const text = await generateContent(prompt, retries);
    return parseJSON(text);
}
