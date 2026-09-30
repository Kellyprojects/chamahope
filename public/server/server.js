const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors());

// Database Connection (Replace with your MongoDB connection string if needed)
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/chama-platform';

mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected successfully to Chama database'))
.catch((err) => console.error('MongoDB connection error:', err));

// Basic Health Check Route
app.get('/', (req, res) => {
    res.send('Chama Community Platform Backend is running successfully.');
});

// Import and Register Routes
const authRoutes = require('./routes/authRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const taskRoutes = require('./routes/taskRoutes');
const userRoutes = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);
    
// Start Server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});