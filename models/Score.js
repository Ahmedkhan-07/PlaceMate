import mongoose from 'mongoose';

const ScoreSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    round: { type: String, enum: ['aptitude', 'coding', 'technical', 'daily'], required: true },
    topic: { type: String, default: '' },
    difficulty: { type: String, default: 'Medium' },
    score: { type: Number, required: true },
    totalQuestions: { type: Number, default: 10 },
    correctAnswers: { type: Number, default: 0 },
    timeTaken: { type: Number, default: 0 }, // in seconds
    percentage: { type: Number, default: 0 },
    company: { type: String, default: '' },
}, { timestamps: true });

export default mongoose.models.Score || mongoose.model('Score', ScoreSchema);
