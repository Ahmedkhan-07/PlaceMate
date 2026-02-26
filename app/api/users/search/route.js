import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import { requireAuth } from '@/lib/auth';

export async function GET(request) {
    try {
        const auth = await requireAuth(request);
        if (auth.error) return auth.error;

        await dbConnect();
        const { searchParams } = new URL(request.url);
        const q = searchParams.get('q') || '';

        if (!q.trim()) {
            return NextResponse.json({ users: [] });
        }

        const users = await User.find({
            $or: [
                { username: { $regex: q, $options: 'i' } },
                { name: { $regex: q, $options: 'i' } },
            ]
        }).select('name username profilePicture college collegeCode globalRank').limit(5);

        return NextResponse.json({ success: true, users });
    } catch (error) {
        console.error('User search error:', error);
        return NextResponse.json({ success: false, message: error.message || 'Server error' }, { status: 500 });
    }
}
