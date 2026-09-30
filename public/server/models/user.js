const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    fullname: { type: String, required: true },
    phone: { type: String, required: true, unique: true },
    tierLevel: { type: Number, default: 1 },
    pledgeBalance: { type: Number, default: 0 },
    referralBalance: { type: Number, default: 0 },
    supervisorBalance: { type: Number, default: 0 },
    referredBy: { type: String, default: null }, // Referrer phone number
    activeDownlinesCount: { type: Number, default: 0 },
    isSupervisor: { type: Boolean, default: false },
    isAdmin: { type: Boolean, default: false }, // Admin control flag
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', UserSchema);