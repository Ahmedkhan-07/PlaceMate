import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Resume from '@/models/Resume';
import { requireAuth } from '@/lib/auth';
import { uploadBuffer } from '@/lib/cloudinary';

export async function POST(request) {
    try {
        const auth = await requireAuth(request);
        if (auth.error) return auth.error;

        await dbConnect();
        const formData = await request.formData();
        const file = formData.get('file');

        if (!file) {
            return NextResponse.json({ message: 'No file provided' }, { status: 400 });
        }

        const allowedTypes = ['application/pdf'];
        if (!allowedTypes.includes(file.type)) {
            return NextResponse.json({ message: 'Only PDF files are allowed' }, { status: 400 });
        }

        const buffer = Buffer.from(await file.arrayBuffer());

        const result = await uploadBuffer(buffer, {
            folder: 'placemate/resumes',
            resource_type: 'raw',
            format: 'pdf',
        });

        const resume = await Resume.create({
            userId: auth.userId,
            cloudinaryUrl: result.secure_url,
            cloudinaryPublicId: result.public_id,
            originalName: file.name,
        });

        return NextResponse.json({ resume }, { status: 201 });
    } catch (error) {
        console.error('Resume upload error:', error);
        return NextResponse.json({ message: 'Upload failed' }, { status: 500 });
    }
}

export async function GET(request) {
    try {
        const auth = await requireAuth(request);
        if (auth.error) return auth.error;

        await dbConnect();
        const resumes = await Resume.find({ userId: auth.userId }).sort({ createdAt: -1 });
        return NextResponse.json({ resumes });
    } catch (error) {
        return NextResponse.json({ message: 'Server error' }, { status: 500 });
    }
}
