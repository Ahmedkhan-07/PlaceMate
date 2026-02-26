import mongoose from 'mongoose';

const QuestionSchema = new mongoose.Schema({
    topic: { type: String, required: true },
    round: { type: String, enum: ['aptitude', 'coding', 'technical', 'flashcard'], required: true },
    difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'], default: 'Medium' },
    question: { type: String, required: true },
    options: [{ type: String }], // For MCQ
    correctAnswer: { type: String, default: '' },
    explanation: { type: String, default: '' },
    company: { type: String, default: '' },
    type: { type: String, enum: ['mcq', 'coding', 'short', 'flashcard'], default: 'mcq' },
    // For coding questions
    title: { type: String, default: '' },
    description: { type: String, default: '' },
    examples: [{ input: String, output: String, explanation: String }],
    constraints: [{ type: String }],
    testCases: [{ input: String, output: String }],
    // For flashcards
    front: { type: String, default: '' },
    back: { type: String, default: '' },
}, { timestamps: true });

export default mongoose.models.Question || mongoose.model('Question', QuestionSchema);
