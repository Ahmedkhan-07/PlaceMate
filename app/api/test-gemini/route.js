import { generateContent } from '@/lib/gemini';

export async function GET() {
    try {
        console.log('GROQ KEY EXISTS:', !!process.env.GROQ_API_KEY);

        const text = await generateContent('Say hello in one word only');

        return Response.json({ success: true, response: text });

    } catch (error) {
        return Response.json({
            success: false,
            message: error.message,
            details: error.toString()
        });
    }
}
