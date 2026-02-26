import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Score from '@/models/Score';
import User from '@/models/User';
import { requireAuth } from '@/lib/auth';

const BADGES = {
    'First Test Completed': (scores) => scores.length >= 1,
    'Aptitude Master': (scores) => scores.some(s => s.round === 'aptitude' && s.percentage >= 90),
    'Technical Expert': (scores) => {
        const techTopics = new Set(scores.filter(s => s.round === 'technical').map(s => s.topic));
        return techTopics.size >= 8;
    },
    'Coding Champion': (scores) => scores.filter(s => s.round === 'coding').length >= 50,
    'All Rounder': (scores) => {
        const bestApt = Math.max(0, ...scores.filter(s => s.round === 'aptitude').map(s => s.percentage));
        const bestCode = Math.max(0, ...scores.filter(s => s.round === 'coding').map(s => s.percentage));
        const bestTech = Math.max(0, ...scores.filter(s => s.round === 'technical').map(s => s.percentage));
        return bestApt >= 80 && bestCode >= 80 && bestTech >= 80;
    },
};

export async function POST(request) {
    try {
        const auth = await requireAuth(request);
        if (auth.error) return auth.error;

        await dbConnect();
        const body = await request.json();
        const { round, topic, difficulty, score, totalQuestions, correctAnswers, timeTaken, company } = body;

        const percentage = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : score;

        const newScore = await Score.create({
            userId: auth.userId,
            round,
            topic: topic || '',
            difficulty: difficulty || 'Medium',
            score,
            totalQuestions: totalQuestions || 10,
            correctAnswers: correctAnswers || 0,
            timeTaken: timeTaken || 0,
            percentage,
            company: company || '',
        });

        // Badge check
        const allScores = await Score.find({ userId: auth.userId });
        const user = await User.findById(auth.userId);
        const newBadges = [];

        for (const [badgeName, checkFn] of Object.entries(BADGES)) {
            if (!user.badges.includes(badgeName) && checkFn(allScores)) {
                newBadges.push(badgeName);
            }
        }

        if (newBadges.length > 0) {
            user.badges.push(...newBadges);
            await user.save();
        }

        return NextResponse.json({ score: newScore, newBadges }, { status: 201 });
    } catch (error) {
        console.error('Scores error:', error);
        return NextResponse.json({ message: 'Server error' }, { status: 500 });
    }
}

export async function GET(request) {
    try {
        const auth = await requireAuth(request);
        if (auth.error) return auth.error;

        await dbConnect();
        const { searchParams } = new URL(request.url);
        const round = searchParams.get('round');
        const limit = parseInt(searchParams.get('limit') || '50');

        const query = { userId: auth.userId };
        if (round) query.round = round;

        const scores = await Score.find(query).sort({ createdAt: -1 }).limit(limit);
        return NextResponse.json({ scores });
    } catch (error) {
        return NextResponse.json({ message: 'Server error' }, { status: 500 });
    }
}
