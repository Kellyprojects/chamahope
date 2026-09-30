const mongoose = require('mongoose');

const PledgeSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    tierLevel: { type: Number, required: true },
    pledgeAmount: { type: Number, required: true },
    returnAmount: { type: Number, required: true },
    paymentMethod: { type: String, enum: ['USDT', 'BTC'], required: true },
    txHash: { type: String, required: true, unique: true },
    status: { type: String, enum: ['pending_verification', 'active', 'completed', 'frozen'], default: 'pending_verification' },
    weeklySchedule: {
        week1: { amount: { type: Number, default: 0 }, status: { type: String, default: 'pending' } },
        week2: { amount: { type: Number, default: 0 }, status: { type: String, default: 'pending' } },
        week3: { amount: { type: Number, default: 0 }, status: { type: String, default: 'pending' } },
        week4: { amount: { type: Number, default: 0 }, status: { type: String, default: 'pending' } }
    },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Pledge', PledgeSchema);