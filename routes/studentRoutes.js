const express = require('express');
const router = express.Router();
const multer = require('multer');
const fs = require('fs');
const PDFDocument = require('pdfkit');
const Student = require('../models/students'); 
const cors = require('cors');
router.use(cors());

// Configuring Multer for file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads');
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});

const upload = multer({ storage: storage });


// POST endpoint for generating ID cards
router.post('/', upload.fields([{ name: 'photo', maxCount: 1 }, { name: 'signature', maxCount: 1 }]), async (req, res) => {
  try {
    const { photo, signature } = req.files;

    // Check if files are present or not
    if (!photo || !signature) {
      return res.status(400).json({ error: 'Both photo and signature files are required.' });
    }

    // Function for fetching random student data from the Random User Generator API
    async function fetchRandomStudentData() {
      const response = await fetch('https://randomuser.me/api/?results=10');
      const data = await response.json();
      return data.results;
    }

    // Fetch random student data
    const studentsData = await fetchRandomStudentData();

    // Generating ID cards as PDF files with photo, signature, and student data
    const students = [];

    for (let i = 0; i < studentsData.length; i++) {
      const student = studentsData[i];
      const doc = new PDFDocument();
      const filePath = `./id-cards/student_${student.name.first}_${i + 1}.pdf`;
      const stream = fs.createWriteStream(filePath);

      doc.pipe(stream);

      // Adding student information to ID card
      doc.fontSize(16).text(`Name: ${student.name.first} ${student.name.last}`, { align: 'left' });
      doc.fontSize(16).text(`ID: ${i + 1}`, { align: 'left' });
      doc.image(photo[0].path, 100, 100, { width: 200 });
      doc.image(signature[0].path, 100, 300, { width: 200 });

      doc.end();

      // Save student data into our MongoDB using the our Student Interface/model
      const newStudent = new Student({
        studentId: `STU-${i + 1}`,
        name: `${student.name.first} ${student.name.last}`,
        photoPath: photo[0].path,
        signaturePath: signature[0].path,
        pdfPath: filePath
      });
      await newStudent.save();

      students.push({ id: i + 1, name: `${student.name.first} ${student.name.last}`, filePath: filePath , studentId: `STU-${i + 1}`});
    }
    res.status(200).json({ status: 'success', data: students });
  } catch (error) {
    console.error('Error generating ID cards:', error);
    res.status(500).json({ status: 'error' , data:  'Internal Server Error'});
  }
});

module.exports = router;
