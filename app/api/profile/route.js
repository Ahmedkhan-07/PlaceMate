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
        const username = searchParams.get('username');

        let user;
        if (username) {
            user = await User.findOne({ username: { $regex: new RegExp(`^${username}$`, 'i') } });
        } else {
            user = await User.findById(auth.userId);
        }

        if (!user) return NextResponse.json({ message: 'User not found' }, { status: 404 });

        return NextResponse.json({ success: true, user });
    } catch (error) {
        console.error('Profile GET error:', error);
        return NextResponse.json({ success: false, message: error.message || 'Server error' }, { status: 500 });
    }
}

export async function PUT(request) {
    try {
        const auth = await requireAuth(request);
        if (auth.error) return auth.error;

        await dbConnect();
        const body = await request.json();

        const allowedFields = [
            'name', 'bio', 'year', 'rollNumber', 'leetcodeRank',
            'college', 'collegeCode', 'branch', 'section',
            'linkedinUrl', 'githubUrl', 'leetcodeUrl', 'hackerrankUrl', 'portfolioUrl', 'twitterUrl',
            'privacySettings', 'profilePicture', 'topicsCompleted',
            'resumeUrl', 'resumeFilename', 'resumeUploadDate', 'resumeScore', 'resumeSuggestions',
        ];

        const updates = {};
        for (const field of allowedFields) {
            if (body[field] !== undefined) {
                updates[field] = field === 'collegeCode' && body[field]
                    ? body[field].toUpperCase()
                    : body[field];
            }
        }

        const user = await User.findByIdAndUpdate(auth.userId, updates, { new: true });
        return NextResponse.json({ success: true, message: 'Profile updated', user });
    } catch (error) {
        console.error('Profile PUT error:', error);
        return NextResponse.json({ success: false, message: error.message || 'Server error' }, { status: 500 });
    }
}
