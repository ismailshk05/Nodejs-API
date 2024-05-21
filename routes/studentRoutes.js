const express = require('express');
const cors = require('cors');
const router = express.Router();
const PDFDocument = require('pdfkit');
const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');

// Enable CORS for all routes
router.use(cors());

router.get('/', async (req, res) => {
  try {
    // Fetch random user data
    const randomUsersResponse = await fetch('https://randomuser.me/api/?results=30');
    if (!randomUsersResponse.ok) {
      throw new Error('Failed to fetch random user data');
    }
    const { results } = await randomUsersResponse.json();

    // Creating a PDF document
    const doc = new PDFDocument();
    const buffers = [];

    // Adjusting smaller page size
    const cardWidth = 400;
    const cardHeight = 200;
    doc.page.width = cardWidth;
    doc.page.height = cardHeight;

    // Calculating center offsets for X & Y 
    const xOffset = (doc.page.width - cardWidth) / 2;
    const yOffset = (doc.page.height - cardHeight) / 2;

    // Looping through each random user data
    for (const user of results) {
      // Add a new page for each user
      doc.addPage();

      // Placing background Image for ID card
      const backgroundImgPath = path.join(__dirname, '..', 'background.png');
      doc.image(backgroundImgPath, 0, 0, { width: cardWidth, height: cardHeight });

      // Placing Logo Image & setting height & width
      const logoImgPath = path.join(__dirname, '..', 'logo.png');
      doc.image(logoImgPath, xOffset + 25, yOffset + 25, { width: 60 });

      const instituteName = 'EduLabs Technologies';
      doc.fontSize(20).text(instituteName, xOffset + 100, yOffset + 10, { align: 'top' });

      // Adding User information
      doc.fontSize(10).text(`Name: ${user.name.first} ${user.name.last}`, xOffset + 100, yOffset + 50);
      doc.fontSize(10).text(`Email: ${user.email}`, xOffset + 100, yOffset + 70);
      doc.fontSize(10).text(`Gender: ${user.gender}`, xOffset + 100, yOffset + 90);
      doc.fontSize(10).text(`Location: ${user.location.city}, ${user.location.country}`, xOffset + 100, yOffset + 110);

      // Placing Profile picture on ID Card
      const photoImgResponse = await fetch(user.picture.large);
      if (!photoImgResponse.ok) {
        throw new Error('Failed to fetch profile picture');
      }
      const photoImgBuffer = await photoImgResponse.buffer();
      doc.image(photoImgBuffer, xOffset + 280, yOffset + 40, { width: 100 });
    }

      // Geting buffers Data
      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => {
      const pdfBuffer = Buffer.concat(buffers);

      // Writing our PDF buffer to  a file
      const filePath = path.join(__dirname, '..', 'id-cards', 'random_users_id_cards.pdf');
      fs.writeFileSync(filePath, pdfBuffer);

      // Sending the PDF in the response
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'inline; filename=random_users_id_cards.pdf');
      res.send(pdfBuffer);
    });
    doc.end();

  } catch (error) {
    // Handling Error
    console.error('Error generating ID cards:', error);
    res.status(500).json({ status: 'error', message: error.message || 'Internal Server Error' });
  }
});

module.exports = router;
