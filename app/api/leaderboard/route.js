import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import Score from '@/models/Score';
import Streak from '@/models/Streak';
import { requireAuth } from '@/lib/auth';

export async function GET(request) {
    try {
        const auth = await requireAuth(request);
        if (auth.error) return auth.error;

        await dbConnect();
        const { searchParams } = new URL(request.url);
        const filter = searchParams.get('filter') || 'global';
        const sortBy = searchParams.get('sortBy') || 'total';
        const page = parseInt(searchParams.get('page') || '1');
        const limit = 20;

        const currentUser = await User.findById(auth.userId);

        // Build query filter — use collegeCode as primary key for grouping
        let userFilter = {};
        if (filter === 'section') {
            userFilter = {
                collegeCode: currentUser.collegeCode,
                branch: currentUser.branch,
                section: currentUser.section
            };
        } else if (filter === 'branch') {
            userFilter = { collegeCode: currentUser.collegeCode, branch: currentUser.branch };
        } else if (filter === 'year') {
            userFilter = { collegeCode: currentUser.collegeCode, year: currentUser.year };
        } else if (filter === 'college') {
            userFilter = { collegeCode: currentUser.collegeCode };
        }

        const users = await User.find(userFilter).select(
            'name username profilePicture college collegeCode branch section year badges globalRank'
        );

        // Get scores for all users
        const leaderboard = await Promise.all(users.map(async (user) => {
            const scores = await Score.find({ userId: user._id });
            const streak = await Streak.findOne({ userId: user._id });

            const aptScores = scores.filter(s => s.round === 'aptitude');
            const codingScores = scores.filter(s => s.round === 'coding');
            const techScores = scores.filter(s => s.round === 'technical');

            const avgApt = aptScores.length ? Math.round(aptScores.reduce((a, s) => a + s.percentage, 0) / aptScores.length) : 0;
            const avgCoding = codingScores.length ? Math.round(codingScores.reduce((a, s) => a + s.percentage, 0) / codingScores.length) : 0;
            const avgTech = techScores.length ? Math.round(techScores.reduce((a, s) => a + s.percentage, 0) / techScores.length) : 0;
            const total = Math.round((avgApt + avgCoding + avgTech) / 3);

            return {
                _id: user._id,
                name: user.name,
                username: user.username,
                profilePicture: user.profilePicture,
                college: user.college,
                collegeCode: user.collegeCode,
                branch: user.branch,
                section: user.section,
                year: user.year,
                badges: user.badges || [],
                aptitudeScore: avgApt,
                codingScore: avgCoding,
                technicalScore: avgTech,
                totalScore: total,
                streak: streak?.currentStreak || 0,
                attempts: scores.length,
            };
        }));

        // Sort
        const sortKey = {
            total: 'totalScore', aptitude: 'aptitudeScore',
            coding: 'codingScore', technical: 'technicalScore', streak: 'streak'
        }[sortBy] || 'totalScore';
        leaderboard.sort((a, b) => b[sortKey] - a[sortKey]);

        const ranked = leaderboard.map((u, i) => ({ ...u, rank: i + 1 }));
        const userRank = ranked.find(u => u._id.toString() === auth.userId.toString());
        const paginated = ranked.slice((page - 1) * limit, page * limit);

        return NextResponse.json({
            success: true,
            leaderboard: paginated,
            total: ranked.length,
            userRank: userRank || null,
            page,
            totalPages: Math.ceil(ranked.length / limit),
        });
    } catch (error) {
        console.error('Leaderboard error:', error);
        return NextResponse.json({ success: false, message: error.message || 'Server error' }, { status: 500 });
    }
}
