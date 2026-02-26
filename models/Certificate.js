import mongoose from 'mongoose';

const CertificateSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    certificateId: { type: String, required: true, unique: true },
    mockDriveId: { type: mongoose.Schema.Types.ObjectId, ref: 'MockDrive' },
    difficulty: { type: String, required: true },
    aptitudeScore: { type: Number, required: true },
    codingScore: { type: Number, required: true },
    technicalScore: { type: Number, required: true },
    overallPercentage: { type: Number, required: true },
    cloudinaryUrl: { type: String, default: '' },
    cloudinaryPublicId: { type: String, default: '' },
    issuedAt: { type: Date, default: Date.now },
}, { timestamps: true });

export default mongoose.models.Certificate || mongoose.model('Certificate', CertificateSchema);
