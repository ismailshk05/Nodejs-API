const mongoose = require('mongoose');

// Define the schema for student data
const studentSchema = new mongoose.Schema({
  studentId: { type: String, required: true, unique: true },  
  name: String,
  photoPath: String,
  signaturePath: String,
  pdfPath: String
});

// Create and export the Student model
module.exports = mongoose.model('Student', studentSchema);
