const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Simple Admin Passcode (In production, use process.env.ADMIN_SECRET)
const ADMIN_PASSCODE = "ChamaSecureAdmin2026!";

// Middleware to verify admin access
const verifyAdmin = (req, res, next) => {
    const passcode = req.headers['x-admin-passcode'];
    if (passcode !== ADMIN_PASSCODE) {
        return res.status(401).json({ error: 'Unauthorized: Invalid or missing admin passcode.' });
    }
    next();
};

// Get All Users (Protected Admin Route)
router.get('/users', verifyAdmin, async (req, res) => {
    try {
        const users = await User.find({}).sort({ createdAt: -1 });
        res.status(200).json({ users });
    } catch (err) {
        res.status(500).json({ error: 'Error fetching users', details: err.message });
    }
});

// Admin Control: Update User Tier Level (Protected)
router.patch('/user/:id/tier', verifyAdmin, async (req, res) => {
    try {
        const { tierLevel } = req.body;
        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            { tierLevel },
            { new: true }
        );
        res.status(200).json({ message: 'User tier updated successfully', user: updatedUser });
    } catch (err) {
        res.status(500).json({ error: 'Error updating tier', details: err.message });
    }
});

// Admin Control: Toggle Supervisor Status (Protected)
router.patch('/user/:id/supervisor', verifyAdmin, async (req, res) => {
    try {
        const { isSupervisor } = req.body;
        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            { isSupervisor },
            { new: true }
        );
        res.status(200).json({ message: 'Supervisor status updated successfully', user: updatedUser });
    } catch (err) {
        res.status(500).json({ error: 'Error updating supervisor status', details: err.message });
    }
});

module.exports = router;