const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RegistrationSchema = new Schema({
    userId: { type: Number, ref: 'Tutor', required: true },
    courseId: {  type: String, ref: 'Course', required: true },
    registeredAt: { type: Date, default: Date.now }, 
    status: { type: String, default: 'Đang chờ' }
});

module.exports = mongoose.model('Registration', RegistrationSchema);