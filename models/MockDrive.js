import mongoose from 'mongoose';

const MockDriveSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard', 'Dynamic'], required: true },
    status: { type: String, enum: ['aptitude', 'coding', 'technical', 'completed', 'abandoned'], default: 'aptitude' },
    aptitudeScore: { type: Number, default: 0 },
    aptitudeCorrect: { type: Number, default: 0 },
    codingScore: { type: Number, default: 0 },
    codingPassed: { type: Number, default: 0 },
    technicalScore: { type: Number, default: 0 },
    technicalCorrect: { type: Number, default: 0 },
    overallScore: { type: Number, default: 0 },
    passed: { type: Boolean, default: false },
    passingCriteria: { type: Number, default: 60 },
    certificateId: { type: String, default: '' },
    aptitudeQuestions: [mongoose.Schema.Types.Mixed],
    codingQuestions: [mongoose.Schema.Types.Mixed],
    technicalQuestions: [mongoose.Schema.Types.Mixed],
    startedAt: { type: Date, default: Date.now },
    completedAt: { type: Date },
}, { timestamps: true });

export default mongoose.models.MockDrive || mongoose.model('MockDrive', MockDriveSchema);
