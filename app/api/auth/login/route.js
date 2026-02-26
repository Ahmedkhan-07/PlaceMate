import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import { signToken } from '@/lib/auth';

export async function POST(request) {
    try {
        await dbConnect();
        const { email, password } = await request.json();

        if (!email || !password) {
            return NextResponse.json({ message: 'Email and password are required' }, { status: 400 });
        }

        const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
        if (!user) {
            return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
        }

        const token = signToken({ userId: user._id });

        return NextResponse.json({
            message: 'Login successful',
            token,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                username: user.username,
                college: user.college,
                branch: user.branch,
                section: user.section,
                year: user.year,
                profilePicture: user.profilePicture,
                badges: user.badges,
                privacySettings: user.privacySettings,
                linkedinUrl: user.linkedinUrl,
                githubUrl: user.githubUrl,
                leetcodeUrl: user.leetcodeUrl,
                hackerrankUrl: user.hackerrankUrl,
                portfolioUrl: user.portfolioUrl,
            },
        });
    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json({ message: 'Server error' }, { status: 500 });
    }
}
