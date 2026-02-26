import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import { requireAuth } from '@/lib/auth';
import { COMPANIES } from '@/lib/companies';

export async function GET(request) {
    try {
        const auth = await requireAuth(request);
        if (auth.error) return auth.error;

        await dbConnect();
        const user = await User.findById(auth.userId);

        // Merge static company list with user's saved statuses
        const statusMap = {};
        for (const cs of (user.companyStatus || [])) {
            statusMap[cs.companyName] = cs;
        }

        const companies = COMPANIES.map(c => ({
            ...c,
            isChecked: statusMap[c.name]?.isChecked || false,
            status: statusMap[c.name]?.status || 'Not Applied',
            placementDate: statusMap[c.name]?.placementDate || null,
        }));

        return NextResponse.json({ companies, calendar: user.placementCalendar || [] });
    } catch (error) {
        return NextResponse.json({ message: 'Server error' }, { status: 500 });
    }
}

export async function PUT(request) {
    try {
        const auth = await requireAuth(request);
        if (auth.error) return auth.error;

        await dbConnect();
        const { companyName, isChecked, status, placementDate } = await request.json();

        const user = await User.findById(auth.userId);
        const idx = user.companyStatus.findIndex(c => c.companyName === companyName);

        if (idx >= 0) {
            if (isChecked !== undefined) user.companyStatus[idx].isChecked = isChecked;
            if (status !== undefined) user.companyStatus[idx].status = status;
            if (placementDate !== undefined) user.companyStatus[idx].placementDate = placementDate;
        } else {
            user.companyStatus.push({ companyName, isChecked: isChecked || false, status: status || 'Not Applied', placementDate: placementDate || null });
        }

        await user.save();
        return NextResponse.json({ message: 'Updated' });
    } catch (error) {
        return NextResponse.json({ message: 'Server error' }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        const auth = await requireAuth(request);
        if (auth.error) return auth.error;

        await dbConnect();
        const { companyName, placementDate, notes } = await request.json();

        const user = await User.findById(auth.userId);
        user.placementCalendar.push({ companyName, placementDate, notes });
        await user.save();

        return NextResponse.json({ message: 'Added to calendar', calendar: user.placementCalendar });
    } catch (error) {
        return NextResponse.json({ message: 'Server error' }, { status: 500 });
    }
}
