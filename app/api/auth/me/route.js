import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import { requireAuth } from '@/lib/auth';

export async function GET(request) {
    try {
        const auth = await requireAuth(request);
        if (auth.error) return auth.error;

        await dbConnect();
        const user = await User.findById(auth.userId);
        if (!user) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }

        return NextResponse.json({ user });
    } catch (error) {
        console.error('Me error:', error);
        return NextResponse.json({ message: 'Server error' }, { status: 500 });
    }
}
