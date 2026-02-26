import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Resume from '@/models/Resume';
import { generateJSON } from '@/lib/gemini';
import { requireAuth } from '@/lib/auth';

export async function POST(request) {
    try {
        const auth = await requireAuth(request);
        if (auth.error) return auth.error;

        await dbConnect();
        const { resumeId, resumeUrl } = await request.json();

        const prompt = `Analyze this resume PDF (available at: ${resumeUrl}) for a software engineering role at a top tech company.
Return ONLY a valid JSON object with:
- "score": number (0-100, overall resume quality score)
- "strengths": array of 3-5 strings (what the resume does well)
- "missingSections": array of strings (important sections that are missing or weak)
- "suggestions": array of 4-6 strings (specific actionable improvements)
- "skillsGap": array of 3-5 strings (skills missing based on top tech company requirements like Google, Microsoft, Amazon)

Be specific and actionable. Return ONLY the JSON object.`;

        const analysis = await generateJSON(prompt);

        const resume = await Resume.findByIdAndUpdate(
            resumeId,
            { analysis, isAnalyzed: true },
            { new: true }
        );

        return NextResponse.json({ analysis, resume });
    } catch (error) {
        console.error('Resume analyze error:', error);
        return NextResponse.json({ message: 'Analysis failed. Please try again.' }, { status: 500 });
    }
}
