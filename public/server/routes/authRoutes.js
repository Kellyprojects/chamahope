const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Register a New User
router.post('/register', async (req, res) => {
    try {
        const { fullname, phone, referredBy } = req.body;

        // Check if user with this phone number already exists
        const existingUser = await User.findOne({ phone });
        if (existingUser) {
            return res.status(400).json({ error: 'This phone number is already registered on the platform.' });
        }

        // Handle referral tracking if code is provided
        let assignedReferrer = null;
        if (referredBy) {
            assignedReferrer = await User.findOne({ phone: referredBy });
            if (assignedReferrer) {
                assignedReferrer.activeDownlinesCount += 1;
                // Auto-promote to supervisor if 5 active downlines reached
                if (assignedReferrer.activeDownlinesCount >= 5) {
                    assignedReferrer.isSupervisor = true;
                }
                await assignedReferrer.save();
            }
        }

        // Create new user record (without NIN/BVN)
        const newUser = new User({
            fullname,
            phone,
            referredBy: assignedReferrer ? assignedReferrer.phone : null
        });

        await newUser.save();
        res.status(201).json({ message: 'User registered successfully', user: newUser });
    } catch (err) {
        res.status(500).json({ error: 'Server error during registration', details: err.message });
    }
});

module.exports = router;