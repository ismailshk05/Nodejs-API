const express = require('express');
const mongoose = require('mongoose');
const path = require('path')
const app = express();
const PORT = process.env.PORT || 3000;
const staticDir = path.join(__dirname, 'id-cards'); // Change 'public' to the directory name where your static files are stored

// Serve static files from the 'public' directory
app.use(express.static(staticDir));

// MongoDB Connection
mongoose.connect('mongodb+srv://ismailuser1:ismailuser1@usermanagementdb.vlmwmbt.mongodb.net/')
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error(err));

// Middleware
app.use(express.json()); // Parse JSON requests

// Routes
const studentRoutes = require('./routes/studentRoutes');
app.use('/api/students', studentRoutes);


// Start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
