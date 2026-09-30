const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Get User Profile & Wallet Balances by ID or Phone
router.get('/:identifier', async (req, res) => {
    try {
        const identifier = req.params.identifier;
        const user = await User.findOne({ $or: [{ _id: identifier.match(/^[0-9a-fA-F]{24}$/) ? identifier : null }, { phone: identifier }] });

        if (!user) {
            return res.status(404).json({ error: 'User profile not found.' });
        }

        res.status(200).json({ user });
    } catch (err) {
        res.status(500).json({ error: 'Error fetching user profile', details: err.message });
    }
});

module.exports = router;