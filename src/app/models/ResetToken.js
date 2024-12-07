// models/ResetToken.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ResetTokenSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
    token: { type: String, required: true },
    createdAt: { type: Date, default: Date.now, expires: 900 } // Hết hạn sau 15 phút (900 giây)
});

module.exports = mongoose.model('ResetToken', ResetTokenSchema);