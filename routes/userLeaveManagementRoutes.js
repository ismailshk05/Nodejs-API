const express = require("express");
const router = express.Router();
const UserLeaveManagement = require("../models/userLeaveManagement");
const verifyToken = require('../middleware/authMiddleware');

router.post("/addLeave", verifyToken, async (req, res) => {
  try {
    const { title, fromDate, toDate, reason } = req.body;
    const leaveManagementEntry = await UserLeaveManagement.create({
      title,
      fromDate,
      toDate,
      reason,
    });
    res.status(201).json({ leaveManagementEntry });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// get req with pagination
router.get("/getLeave", verifyToken, async (req, res) => {
    try {
      let allLeaves;
      let totalCount;
  
      // Check if pagination parameters are provided
      if (req.query.page && req.query.pageSize) {
        const page = parseInt(req.query.page); // Current page number
        const pageSize = parseInt(req.query.pageSize); // Number of items per page
  
        // Calculate the skip value to determine where to start fetching data from
        const skip = (page - 1) * pageSize;
  
        // Fetch leave entries with pagination
        allLeaves = await UserLeaveManagement.find().skip(skip).limit(pageSize);
  
        // Count total number of leave entries
        totalCount = await UserLeaveManagement.countDocuments();
      } else {
        // Fetch all leave entries without pagination
        allLeaves = await UserLeaveManagement.find();
        totalCount = allLeaves.length; // Total count is the length of all leave entries
      }
  
      // Response object containing leave entries and pagination metadata
      const response = {
        allLeaves,
        pagination: {
          totalCount,
          totalPages: Math.ceil(totalCount / req.query.pageSize), // Calculate total pages if pagination parameters are provided
          currentPage: req.query.page || 1, // Current page number
          pageSize: req.query.pageSize || totalCount // Number of items per page
        }
      };
  
      res.json(response);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });
  
  

router.get("/:id", verifyToken, async (req, res) => {
  try {
    const leaveById = await UserLeaveManagement.findById(req.params.id);
    if (leaveById) {
      res.status(200).json({ leaveById });
    } else {
      res.status(404).json({ message: "Leave entry not found" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.put("/:id", verifyToken, async (req, res) => {
  try {
    const { title, fromDate, toDate, reason } = req.body;
    const updatedLeaves = await UserLeaveManagement.findByIdAndUpdate(
      req.params.id,
      { title, fromDate, toDate, reason },
      { new: true }
    );
    if (updatedLeaves) {
      res.status(200).json({ updatedLeave });
    } else {
      res.status(404).json({ message: "Leave entry not found" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});


router.delete('/:id', verifyToken, async (req, res) => {
    try {
        const deleteAppliedLeave = await UserLeaveManagement.findByIdAndDelete(req.params.id);
        
        if(deleteAppliedLeave){
            res.status(200).json({ message: 'User deleted successfully' });
        }else{
            res.status(404).json({ message: "Leave entry not found" });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;
