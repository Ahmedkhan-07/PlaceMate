import mongoose from 'mongoose';

const StreakSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    currentStreak: { type: Number, default: 0 },
    longestStreak: { type: Number, default: 0 },
    lastActiveDate: { type: String, default: '' }, // YYYY-MM-DD
    history: [{ type: String }], // Array of YYYY-MM-DD strings
}, { timestamps: true });

export default mongoose.models.Streak || mongoose.model('Streak', StreakSchema);
