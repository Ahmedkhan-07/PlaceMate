import { NextResponse } from 'next/server';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import dbConnect from '@/lib/db';
import User from '@/models/User';

export async function POST(request) {
    try {
        await dbConnect();
        const { email } = await request.json();

        if (!email) {
            return NextResponse.json({ message: 'Email is required' }, { status: 400 });
        }

        const user = await User.findOne({ email: email.toLowerCase() });
        // Always return same message for security
        if (!user) {
            return NextResponse.json({ message: 'If this email exists, you will receive a reset link' });
        }

        const token = crypto.randomBytes(32).toString('hex');
        const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

        user.resetPasswordToken = hashedToken;
        user.resetPasswordExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
        await user.save();

        const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/auth/reset-password/${token}`;

        const transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: parseInt(process.env.EMAIL_PORT || '587'),
            secure: false,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        await transporter.sendMail({
            from: process.env.EMAIL_FROM,
            to: email,
            subject: 'PlaceMate - Reset Your Password',
            html: `
        <div style="font-family: Inter, sans-serif; max-width: 520px; margin: 0 auto; padding: 32px; background: #F8F9FA; border-radius: 16px;">
          <h2 style="color: #1E293B; margin-bottom: 16px;">Reset Your Password</h2>
          <p style="color: #64748B; margin-bottom: 24px;">Click the button below to reset your PlaceMate password. This link expires in 1 hour.</p>
          <a href="${resetUrl}" style="background: linear-gradient(135deg, #2563EB, #6366F1); color: white; padding: 12px 24px; border-radius: 10px; text-decoration: none; font-weight: 600; display: inline-block; margin-bottom: 24px;">Reset Password</a>
          <p style="color: #94A3B8; font-size: 12px;">If you didn't request this, ignore this email. Link: ${resetUrl}</p>
        </div>
      `,
        });

        return NextResponse.json({ message: 'If this email exists, you will receive a reset link' });
    } catch (error) {
        console.error('Forgot password error:', error);
        return NextResponse.json({ message: 'If this email exists, you will receive a reset link' });
    }
}
