const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    tierLevel: { type: Number, required: true },
    taskType: { type: String, required: true }, // e.g., "social_share", "safety_quiz", "feedback"
    proofData: { type: String, required: true }, // Screenshot URL or quiz score
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Task', TaskSchema);