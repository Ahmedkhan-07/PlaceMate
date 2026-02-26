import mongoose from 'mongoose';

const DailyChallengeSchema = new mongoose.Schema({
    date: { type: String, required: true, unique: true }, // YYYY-MM-DD
    round: { type: String, enum: ['aptitude', 'coding', 'technical'], required: true },
    question: { type: String, required: true },
    options: [{ type: String }],
    correctAnswer: { type: String, required: true },
    explanation: { type: String, default: '' },
    topic: { type: String, default: '' },
    difficulty: { type: String, default: 'Medium' },
    // Track which users answered
    completedBy: [{
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        answer: String,
        isCorrect: Boolean,
        answeredAt: Date,
    }],
}, { timestamps: true });

export default mongoose.models.DailyChallenge || mongoose.model('DailyChallenge', DailyChallengeSchema);
