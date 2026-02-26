import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import MockDrive from '@/models/MockDrive';
import User from '@/models/User';
import { requireAuth } from '@/lib/auth';

export async function POST(request) {
    try {
        const auth = await requireAuth(request);
        if (auth.error) return auth.error;

        await dbConnect();
        const { driveId, aptitudeCorrect, codingPassed, technicalCorrect } = await request.json();

        const drive = await MockDrive.findById(driveId);
        if (!drive || drive.userId.toString() !== auth.userId) {
            return NextResponse.json({ message: 'Drive not found' }, { status: 404 });
        }

        const aptitudeScore = Math.round((aptitudeCorrect / 10) * 100);
        const codingScore = Math.round((codingPassed / 2) * 100);
        const technicalScore = Math.round((technicalCorrect / 10) * 100);
        const overallScore = Math.round((aptitudeScore + codingScore + technicalScore) / 3);

        const passed = overallScore >= drive.passingCriteria;

        drive.aptitudeScore = aptitudeScore;
        drive.aptitudeCorrect = aptitudeCorrect;
        drive.codingScore = codingScore;
        drive.codingPassed = codingPassed;
        drive.technicalScore = technicalScore;
        drive.technicalCorrect = technicalCorrect;
        drive.overallScore = overallScore;
        drive.passed = passed;
        drive.status = 'completed';
        drive.completedAt = new Date();
        await drive.save();

        // Award badges
        const user = await User.findById(auth.userId);
        const newBadges = [];
        if (!user.badges.includes('Placement Ready')) newBadges.push('Placement Ready');
        if (drive.difficulty === 'Hard' && passed && !user.badges.includes('Hard Mode Champion')) {
            newBadges.push('Hard Mode Champion');
        }
        if (newBadges.length > 0) {
            user.badges.push(...newBadges);
            await user.save();
        }

        return NextResponse.json({
            passed,
            aptitudeScore,
            codingScore,
            technicalScore,
            overallScore,
            passingCriteria: drive.passingCriteria,
            driveId: drive._id,
            newBadges,
        });
    } catch (error) {
        console.error('Mock drive submit error:', error);
        return NextResponse.json({ message: 'Server error' }, { status: 500 });
    }
}
