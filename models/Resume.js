import mongoose from 'mongoose';

const ResumeSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    cloudinaryUrl: { type: String, required: true },
    cloudinaryPublicId: { type: String, default: '' },
    originalName: { type: String, default: '' },
    analysis: {
        score: { type: Number, default: 0 },
        strengths: [{ type: String }],
        missingSections: [{ type: String }],
        suggestions: [{ type: String }],
        skillsGap: [{ type: String }],
    },
    isAnalyzed: { type: Boolean, default: false },
}, { timestamps: true });

export default mongoose.models.Resume || mongoose.model('Resume', ResumeSchema);
