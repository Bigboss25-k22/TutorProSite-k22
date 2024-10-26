const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CourseSchema = new Schema({
  course_id: { type: Number, required: true, unique: true }, // ID khóa học
  parent_id: { type: Number, required: true },               // ID phụ huynh
  course_name: { type: String, required: true },             // Tên khóa học
  subject: { type: String, required: true },                 // Môn học
  description: { type: String },                             // Mô tả khóa học
  status: { type: String, default: "Đang mở" },              // Trạng thái khóa học
  fee: { type: Number, required: true },                     // Học phí
}, {
  timestamps: true, // Tự động thêm createdAt và updatedAt
});

module.exports = mongoose.model('Course', CourseSchema);
