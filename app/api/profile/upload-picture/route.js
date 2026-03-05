import { verifyToken } from '@/lib/auth'
import connectDB from '@/lib/db'
import User from '@/models/User'
import { uploadBuffer } from '@/lib/cloudinary'

export async function POST(req) {
    try {
        await connectDB()

        const token = req.headers.get('authorization')?.replace('Bearer ', '')
        if (!token) {
            return Response.json({ success: false, message: 'Unauthorized' }, { status: 401 })
        }

        const decoded = verifyToken(token)
        if (!decoded) {
            return Response.json({ success: false, message: 'Invalid token' }, { status: 401 })
        }

        const formData = await req.formData()
        const file = formData.get('profilePicture')

        if (!file) {
            return Response.json({ success: false, message: 'No file provided' }, { status: 400 })
        }

        if (!file.type.startsWith('image/')) {
            return Response.json({ success: false, message: 'Only image files allowed' }, { status: 400 })
        }

        if (file.size > 5 * 1024 * 1024) {
            return Response.json({ success: false, message: 'Image must be under 5MB' }, { status: 400 })
        }

        const bytes = await file.arrayBuffer()
        const buffer = Buffer.from(bytes)

        const uploadResult = await uploadBuffer(buffer, {
            resource_type: 'image',
            folder: 'placemate/profile-pictures',
            public_id: `pfp_${decoded.userId}`,
            overwrite: true,
            transformation: [
                { width: 400, height: 400, crop: 'fill', gravity: 'face' }
            ]
        })

        await User.findByIdAndUpdate(decoded.userId, {
            profilePicture: uploadResult.secure_url
        })

        return Response.json({
            success: true,
            url: uploadResult.secure_url,
            message: 'Profile picture updated successfully'
        }, { status: 200 })

    } catch (error) {
        console.error('Profile picture upload error:', error)
        return Response.json({
            success: false,
            message: 'Upload failed: ' + error.message
        }, { status: 500 })
    }
}
