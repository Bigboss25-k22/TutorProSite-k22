const mongoose = require("mongoose");
const AutoIncrement=require('mongoose-sequence')(mongoose);
const Schema = mongoose.Schema;

const CourseSchema = new Schema({
  //_id: { type: Number },            // ID khóa học
  //parent_id: { type: Number, required: true },                       // ID phụ huynh
  //course_name: { type: String, required: true },                     // Tên khóa học
  subject: { type: String, required: true },                         // Môn học
  grade: { type: String, required: true },                           // Lớp dạy
  address: { type: String, required: true },                         // Địa chỉ
  salary: { type: Number, required: true },                      // Học phí theo tháng  
  sessions: { type: String, required: true },                       // Số buổi
  schedule: { type: String, required: true },                       // Thời gian
  studentInfo: { type: String },                                    // Thông tin học sinh
  requirements: { type: String },                                   // Yêu cầu
  teachingMode: { type: String, required: true },                  // Hình thức (offline/online)
  contact: { type: String, required: true },                        // Liên hệ
  status: { type: String, default: "Đang mở" },
  slug:{type: String},
}, {
  //_id: false,
  timestamps: true, // Tự động thêm createdAt và updatedAt
});

//CourseSchema.plugin(AutoIncrement);

module.exports = mongoose.model('Course', CourseSchema);
