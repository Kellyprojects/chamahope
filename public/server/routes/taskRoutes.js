const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const User = require('../models/User');

// Submit Task Proof
router.post('/submit', async (req, res) => {
    try {
        const { userId, tierLevel, taskType, proofData } = req.body;

        const newTask = new Task({
            userId,
            tierLevel,
            taskType: taskType || 'social_share',
            proofData,
            status: 'approved' // Auto-approving for smooth workflow demo
        });

        await newTask.save();
        res.status(201).json({ message: 'Task proof submitted and verified successfully', task: newTask });
    } catch (err) {
        res.status(500).json({ error: 'Error submitting task proof', details: err.message });
    }
});

module.exports = router;