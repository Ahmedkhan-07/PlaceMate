import { v2 as cloudinary } from 'cloudinary'
import { verifyToken } from '@/lib/auth'
import connectDB from '@/lib/db'
import User from '@/models/User'

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

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
        const file = formData.get('resume')

        if (!file) {
            return Response.json({ success: false, message: 'No file provided' }, { status: 400 })
        }

        // check file type
        if (file.type !== 'application/pdf') {
            return Response.json({ success: false, message: 'Only PDF files allowed' }, { status: 400 })
        }

        // check file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            return Response.json({ success: false, message: 'File size must be under 5MB' }, { status: 400 })
        }

        // convert to buffer
        const bytes = await file.arrayBuffer()
        const buffer = Buffer.from(bytes)

        // upload to cloudinary
        const uploadResult = await new Promise((resolve, reject) => {
            cloudinary.uploader.upload_stream(
                {
                    resource_type: 'raw',
                    folder: 'placemate/resumes',
                    format: 'pdf',
                    public_id: `resume_${decoded.id}_${Date.now()}`
                },
                (error, result) => {
                    if (error) reject(error)
                    else resolve(result)
                }
            ).end(buffer)
        })

        // save to user document
        await User.findByIdAndUpdate(decoded.id, {
            $push: {
                resumeHistory: {
                    url: uploadResult.secure_url,
                    publicId: uploadResult.public_id,
                    filename: file.name,
                    uploadedAt: new Date()
                }
            },
            currentResume: uploadResult.secure_url
        })

        return Response.json({
            success: true,
            url: uploadResult.secure_url,
            message: 'Resume uploaded successfully'
        }, { status: 200 })

    } catch (error) {
        console.error('Resume upload error:', error)
        return Response.json({ success: false, message: 'Upload failed: ' + error.message }, { status: 500 })
    }
}
