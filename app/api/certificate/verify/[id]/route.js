import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Certificate from '@/models/Certificate';
import User from '@/models/User';

export async function GET(request, { params }) {
    try {
        await dbConnect();
        const { id } = params;

        const cert = await Certificate.findOne({ certificateId: id })
            .populate('userId', 'name college branch section year');

        if (!cert) {
            return NextResponse.json({ message: 'Certificate not found' }, { status: 404 });
        }

        return NextResponse.json({ certificate: cert });
    } catch (error) {
        return NextResponse.json({ message: 'Server error' }, { status: 500 });
    }
}
