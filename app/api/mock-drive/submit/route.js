import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import MockDrive from '@/models/MockDrive';
import User from '@/models/User';
import Score from '@/models/Score';
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

        const aptitudeScore = Math.round(((aptitudeCorrect || 0) / 10) * 100);
        const codingScore = Math.min(100, Math.round(((codingPassed || 0) / 1) * 100));
        const technicalScore = Math.round(((technicalCorrect || 0) / 10) * 100);
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

        // Save individual round scores → visible on dashboard
        const saveOpts = { userId: auth.userId, difficulty: drive.difficulty || 'Medium', totalQuestions: 10, timeTaken: 0 };
        await Promise.allSettled([
            Score.create({ ...saveOpts, round: 'aptitude', topic: 'Mock Drive – Aptitude', score: aptitudeScore, correctAnswers: aptitudeCorrect || 0, percentage: aptitudeScore }),
            Score.create({ ...saveOpts, round: 'coding', topic: 'Mock Drive – Coding', score: codingScore, correctAnswers: codingPassed || 0, totalQuestions: 1, percentage: codingScore }),
            Score.create({ ...saveOpts, round: 'technical', topic: 'Mock Drive – Technical', score: technicalScore, correctAnswers: technicalCorrect || 0, percentage: technicalScore }),
            Score.create({ ...saveOpts, round: 'mock', topic: 'Mock Drive', score: overallScore, correctAnswers: 0, percentage: overallScore }),
        ]);

        // Award badges
        const user = await User.findById(auth.userId);
        const newBadges = [];
        if (passed && !user.badges.includes('Placement Ready')) newBadges.push('Placement Ready');
        if (drive.difficulty === 'Hard' && passed && !user.badges.includes('Hard Mode Champion')) newBadges.push('Hard Mode Champion');
        if (newBadges.length > 0) { user.badges.push(...newBadges); await user.save(); }

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
