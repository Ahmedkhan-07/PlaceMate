import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import Score from '@/models/Score';
import Streak from '@/models/Streak';
import { requireAuth } from '@/lib/auth';

// All badge definitions
const BADGE_CHECKS = [
    { id: 'First Step', check: (data) => data.totalScores >= 1 },
    { id: 'Aptitude Starter', check: (data) => data.aptScores >= 1 },
    { id: 'Code Newbie', check: (data) => data.codingScores >= 1 },
    { id: 'Tech Explorer', check: (data) => data.techScores >= 1 },
    { id: '7 Day Warrior', check: (data) => data.currentStreak >= 7 },
    { id: '30 Day Legend', check: (data) => data.currentStreak >= 30 },
    { id: 'Aptitude Master', check: (data) => data.maxAptPercent >= 90 },
    { id: 'Coding Champion', check: (data) => data.codingScores >= 50 },
    { id: 'Technical Expert', check: (data) => data.techTopicsCount >= 5 },
    { id: 'Speed Demon', check: (data) => data.speedDemon === true },
    { id: 'All Rounder', check: (data) => data.avgApt >= 80 && data.avgCoding >= 80 && data.avgTech >= 80 },
    { id: 'Perfect Score', check: (data) => data.maxPercent >= 100 },
];

export async function POST(request) {
    try {
        const auth = await requireAuth(request);
        if (auth.error) return auth.error;

        await dbConnect();
        const body = await request.json().catch(() => ({}));
        const { speedDemon } = body;

        const user = await User.findById(auth.userId);
        if (!user) return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });

        const scores = await Score.find({ userId: auth.userId });
        const streak = await Streak.findOne({ userId: auth.userId });

        const aptScores = scores.filter(s => s.round === 'aptitude');
        const codingScores = scores.filter(s => s.round === 'coding');
        const techScores = scores.filter(s => s.round === 'technical');

        const data = {
            totalScores: scores.length,
            aptScores: aptScores.length,
            codingScores: codingScores.length,
            techScores: techScores.length,
            currentStreak: streak?.currentStreak || 0,
            maxAptPercent: aptScores.length ? Math.max(...aptScores.map(s => s.percentage || 0)) : 0,
            maxPercent: scores.length ? Math.max(...scores.map(s => s.percentage || 0)) : 0,
            avgApt: aptScores.length ? Math.round(aptScores.reduce((a, s) => a + (s.percentage || 0), 0) / aptScores.length) : 0,
            avgCoding: codingScores.length ? Math.round(codingScores.reduce((a, s) => a + (s.percentage || 0), 0) / codingScores.length) : 0,
            avgTech: techScores.length ? Math.round(techScores.reduce((a, s) => a + (s.percentage || 0), 0) / techScores.length) : 0,
            techTopicsCount: [...new Set(techScores.map(s => s.topic))].length,
            speedDemon: speedDemon || false,
        };

        const newBadges = [];
        for (const badge of BADGE_CHECKS) {
            if (!user.badges.some(b => b === badge.id || b?.name === badge.id) && badge.check(data)) {
                newBadges.push(badge.id);
            }
        }

        if (newBadges.length > 0) {
            user.badges.push(...newBadges);
        }
        // Always deduplicate before saving to fix any existing duplicates
        user.badges = [...new Set(user.badges.map(b => b?.name || b))].filter(Boolean);
        await user.save();

        return NextResponse.json({ success: true, newBadges, allBadges: user.badges });
    } catch (error) {
        console.error('Badges check error:', error);
        return NextResponse.json({ success: false, message: error.message || 'Server error' }, { status: 500 });
    }
}
