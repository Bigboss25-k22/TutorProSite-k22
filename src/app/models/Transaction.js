const mongoose = require("mongoose");
const slug = require('mongoose-slug-generator'); 
const Schema = mongoose.Schema;

// Kích hoạt plugin slug trong mongoose
mongoose.plugin(slug);

const TransactionSchema = new mongoose.Schema({
    _id: { type: String },
    courseId: { type: Number, required: true },
    tutorId: { type: Number, required: true },
    amount: { type: Number, required: true }, // Số tiền thanh toán
    paymentMethod: { type: String, required: true },
    description: { type: String },
    status: { type: String, enum: ['pending', 'completed', 'failed'], default: 'pending' },
}, {
  _id: false,
    timestamps: true, 
});

// Hook tạo tự động _id trước khi lưu
TransactionSchema.pre('save', async function(next) {
    if (this.isNew) {
        // Tìm giao dịch gần nhất để xác định số thứ tự
        const lastTransaction = await mongoose.model('Transaction').findOne().sort({ createdAt: -1 });
        const lastId = lastTransaction ? parseInt(lastTransaction._id.split('-')[2]) : 0;

        // Tạo _id đặc biệt
        this._id = `TX-${this.tutorId}-${this.courseId}-${lastId + 1}`;
    }
    next();
});

module.exports = mongoose.model('Transaction', TransactionSchema);
