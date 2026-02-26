import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Certificate from '@/models/Certificate';
import { requireAuth } from '@/lib/auth';

export async function GET(request) {
    try {
        const auth = await requireAuth(request);
        if (auth.error) return auth.error;

        await dbConnect();
        const certificates = await Certificate.find({ userId: auth.userId }).sort({ createdAt: -1 });
        return NextResponse.json({ certificates });
    } catch (error) {
        console.error('Certificate list error:', error);
        return NextResponse.json({ certificates: [] }, { status: 200 });
    }
}
