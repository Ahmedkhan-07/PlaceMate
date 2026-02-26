import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Streak from '@/models/Streak';
import User from '@/models/User';
import { requireAuth } from '@/lib/auth';
import { format, parseISO, differenceInDays } from 'date-fns';

export async function GET(request) {
    try {
        const auth = await requireAuth(request);
        if (auth.error) return auth.error;

        await dbConnect();
        let streak = await Streak.findOne({ userId: auth.userId });
        if (!streak) {
            streak = await Streak.create({ userId: auth.userId, currentStreak: 0, longestStreak: 0, history: [] });
        }

        return NextResponse.json({ streak });
    } catch (error) {
        return NextResponse.json({ message: 'Server error' }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        const auth = await requireAuth(request);
        if (auth.error) return auth.error;

        await dbConnect();
        const today = format(new Date(), 'yyyy-MM-dd');

        let streak = await Streak.findOne({ userId: auth.userId });
        if (!streak) {
            streak = await Streak.create({ userId: auth.userId, currentStreak: 0, longestStreak: 0, history: [] });
        }

        // Already active today
        if (streak.lastActiveDate === today) {
            return NextResponse.json({ streak, message: 'Already updated today' });
        }

        const yesterday = format(new Date(Date.now() - 86400000), 'yyyy-MM-dd');

        if (streak.lastActiveDate === yesterday) {
            streak.currentStreak += 1;
        } else if (streak.lastActiveDate !== today) {
            streak.currentStreak = 1;
        }

        if (streak.currentStreak > streak.longestStreak) {
            streak.longestStreak = streak.currentStreak;
        }

        streak.lastActiveDate = today;
        if (!streak.history.includes(today)) {
            streak.history.push(today);
        }

        await streak.save();

        // Badge for streak milestones
        const user = await User.findById(auth.userId);
        const newBadges = [];
        if (streak.currentStreak >= 7 && !user.badges.includes('7 Day Streak')) newBadges.push('7 Day Streak');
        if (streak.currentStreak >= 30 && !user.badges.includes('30 Day Streak')) newBadges.push('30 Day Streak');
        if (newBadges.length > 0) {
            user.badges.push(...newBadges);
            await user.save();
        }

        return NextResponse.json({ streak, newBadges });
    } catch (error) {
        return NextResponse.json({ message: 'Server error' }, { status: 500 });
    }
}
