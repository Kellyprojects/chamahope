const express = require('express');
const router = express.Router();
const Pledge = require('../models/Pledge');
const User = require('../models/User');

// Submit a New Tier Pledge with Crypto TxID
router.post('/pledge', async (req, res) => {
    try {
        const { userId, tierLevel, pledgeAmount, returnAmount, paymentMethod, txHash } = req.body;

        // Check if TxHash has already been used
        const existingTx = await Pledge.findOne({ txHash });
        if (existingTx) {
            return res.status(400).json({ error: 'This transaction hash has already been submitted.' });
        }

        // Calculate weekly schedule split (50% week 2, 25% week 3, 25% week 4)
        const weeklySchedule = {
            week1: { amount: 0, status: 'pending' },
            week2: { amount: pledgeAmount * 1.0, status: 'pending' }, // 50% return (total $ return split)
            week3: { amount: pledgeAmount * 0.5, status: 'pending' },
            week4: { amount: pledgeAmount * 0.5, status: 'pending' }
        };

        const newPledge = new Pledge({
            userId,
            tierLevel,
            pledgeAmount,
            returnAmount,
            paymentMethod,
            txHash,
            weeklySchedule,
            status: 'active'
        });

        await newPledge.save();

        // Update user tier level
        await User.findByIdAndUpdate(userId, { tierLevel });

        res.status(201).json({ message: 'Pledge submitted and queued successfully', pledge: newPledge });
    } catch (err) {
        res.status(500).json({ error: 'Error processing pledge submission', details: err.message });
    }
});

module.exports = router;