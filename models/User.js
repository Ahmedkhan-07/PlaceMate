import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, select: false },
    username: { type: String, unique: true, sparse: true, trim: true, lowercase: true },
    profilePicture: { type: String, default: '' },

    // Personal
    bio: { type: String, default: '' },
    year: { type: String, default: '' },
    rollNumber: { type: String, default: '' },
    leetcodeRank: { type: String, default: '' },

    // Academic
    college: { type: String, default: '' },
    collegeCode: { type: String, default: '', uppercase: true },
    branch: { type: String, default: '' },
    section: { type: String, default: '' },

    // Social Links
    linkedinUrl: { type: String, default: '' },
    githubUrl: { type: String, default: '' },
    leetcodeUrl: { type: String, default: '' },
    hackerrankUrl: { type: String, default: '' },
    portfolioUrl: { type: String, default: '' },
    twitterUrl: { type: String, default: '' },

    // Rankings (calculated periodically)
    globalRank: { type: Number, default: 0 },
    collegeRank: { type: Number, default: 0 },
    branchRank: { type: Number, default: 0 },
    sectionRank: { type: Number, default: 0 },

    // Resume
    resumeUrl: { type: String, default: '' },
    resumeFilename: { type: String, default: '' },
    resumeUploadDate: { type: Date },
    resumeScore: { type: Number, default: 0 },
    resumeSuggestions: [{ type: String }],

    // Badges & Privacy
    badges: [{ type: String }],
    privacySettings: {
        showScores: { type: Boolean, default: true },
        showCertificates: { type: Boolean, default: true },
        showStreak: { type: Boolean, default: true },
        showResume: { type: Boolean, default: false },
    },

    // Company tracker
    companyStatus: [{
        companyName: String,
        status: { type: String, enum: ['Not Applied', 'Applied', 'In Process', 'Rejected', 'Offered'], default: 'Not Applied' },
        isChecked: { type: Boolean, default: false },
        placementDate: Date,
    }],
    placementCalendar: [{
        companyName: String,
        placementDate: Date,
        notes: String,
    }],
    topicsCompleted: [{ type: String }],
    resetPasswordToken: { type: String, select: false },
    resetPasswordExpiry: { type: Date, select: false },
}, { timestamps: true });

export default mongoose.models.User || mongoose.model('User', UserSchema);
