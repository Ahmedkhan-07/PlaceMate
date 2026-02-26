import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import { signToken } from '@/lib/auth';

export async function POST(request) {
    try {
        await dbConnect();
        const body = await request.json();
        const { name, email, password, college, collegeCode, branch, section, year } = body;

        if (!name || !email || !password || !college || !branch || !section || !year) {
            return NextResponse.json({ success: false, message: 'All fields are required' }, { status: 400 });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return NextResponse.json({ success: false, message: 'Invalid email format' }, { status: 400 });
        }

        if (password.length < 8) {
            return NextResponse.json({ success: false, message: 'Password must be at least 8 characters' }, { status: 400 });
        }

        const existing = await User.findOne({ email: email.toLowerCase() });
        if (existing) {
            return NextResponse.json({ success: false, message: 'Email already registered' }, { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        // Generate unique username from name — loop until no collision
        let baseUsername = name.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '');
        let username = baseUsername;
        while (await User.findOne({ username })) {
            username = `${baseUsername}_${Math.floor(1000 + Math.random() * 9000)}`;
        }

        const user = await User.create({
            name,
            email: email.toLowerCase(),
            password: hashedPassword,
            college,
            collegeCode: collegeCode ? collegeCode.toUpperCase() : '',
            branch,
            section,
            year,
            username,
        });

        const token = signToken({ userId: user._id });

        return NextResponse.json({
            success: true,
            message: 'Registration successful',
            token,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                username: user.username,
                college: user.college,
                collegeCode: user.collegeCode,
                branch: user.branch,
                section: user.section,
                year: user.year,
                profilePicture: user.profilePicture,
                badges: user.badges,
                privacySettings: user.privacySettings,
            },
        }, { status: 201 });
    } catch (error) {
        console.error('Register error:', error);
        return NextResponse.json({ success: false, message: error.message || 'Server error' }, { status: 500 });
    }
}
