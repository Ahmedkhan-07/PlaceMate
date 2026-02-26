import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Certificate from '@/models/Certificate';
import MockDrive from '@/models/MockDrive';
import User from '@/models/User';
import { requireAuth } from '@/lib/auth';
import { uploadBase64 } from '@/lib/cloudinary';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request) {
    try {
        const auth = await requireAuth(request);
        if (auth.error) return auth.error;

        await dbConnect();
        const { driveId, imageBase64 } = await request.json();

        const drive = await MockDrive.findById(driveId);
        if (!drive || !drive.passed) {
            return NextResponse.json({ message: 'Drive not found or not passed' }, { status: 400 });
        }

        const user = await User.findById(auth.userId);
        const certificateId = uuidv4();

        let cloudinaryUrl = '';
        let cloudinaryPublicId = '';

        if (imageBase64) {
            try {
                const result = await uploadBase64(imageBase64, {
                    folder: 'placemate/certificates',
                    public_id: `cert_${certificateId}`,
                });
                cloudinaryUrl = result.secure_url;
                cloudinaryPublicId = result.public_id;
            } catch (uploadError) {
                console.error('Certificate upload error:', uploadError);
            }
        }

        const cert = await Certificate.create({
            userId: auth.userId,
            certificateId,
            mockDriveId: driveId,
            difficulty: drive.difficulty,
            aptitudeScore: drive.aptitudeScore,
            codingScore: drive.codingScore,
            technicalScore: drive.technicalScore,
            overallPercentage: drive.overallScore,
            cloudinaryUrl,
            cloudinaryPublicId,
        });

        drive.certificateId = certificateId;
        await drive.save();

        return NextResponse.json({
            certificate: cert,
            verifyUrl: `${process.env.NEXT_PUBLIC_APP_URL}/verify/${certificateId}`,
        }, { status: 201 });
    } catch (error) {
        console.error('Certificate generate error:', error);
        return NextResponse.json({ message: 'Server error' }, { status: 500 });
    }
}
