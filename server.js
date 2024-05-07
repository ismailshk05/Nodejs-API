const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = process.env.PORT || 3000;
const PDFDocument = require('pdfkit');


// MongoDB Connection
mongoose.connect('mongodb+srv://ismailuser1:ismailuser1@usermanagementdb.vlmwmbt.mongodb.net/')
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error(err));

// Models
const User = require('./models/User');
const userLeaveManagementSchema = require('./models/userLeaveManagement');

// Middleware
app.use(express.json()); // Parse JSON requests

// Routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const leaveManagementRoutes = require('./routes/userLeaveManagementRoutes');
const studentRoutes = require('./routes/studentRoutes');


app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/leaveManagement', leaveManagementRoutes);
app.use('/api/students', studentRoutes);


// Start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
