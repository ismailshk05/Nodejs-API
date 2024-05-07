const mongoose = require('mongoose');


const userLeaveManagementSchema = new mongoose.Schema({
    title: { type: String, required: true},
    fromDate: { type: Date, required: true},
    toDate: { type: Date, required: true},
    reason: {type: String, required: true}
});

module.exports = mongoose.model('leaveSchema', userLeaveManagementSchema)