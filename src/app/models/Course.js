const mongoose = require("mongoose");
const AutoIncrement=require('mongoose-sequence')(mongoose);
const Schema = mongoose.Schema;
var slug = require('mongoose-slug-generator');

mongoose.plugin(slug);

const CourseSchema = new Schema({
  _id: { type: String },           // ID khóa học
  parent_id: { type: Number, required: true },                       // ID phụ huynh
  tutor_id: { type: Number},                        // ID gia sư
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
  status: {
    type: String,
    default: 'Chưa duyệt'
  },
  slug: { type: String, slug: "subject" ,unique:true},
}, {
  //_id: false,
  timestamps: true, // Tự động thêm createdAt và updatedAt
});

// Pre-save hook to generate custom _id
CourseSchema.pre('save', async function(next) {
  if (this.isNew) {
    const lastCourse = await mongoose.model('Course').findOne().sort({ _id: -1 });
    const lastId = lastCourse ? parseInt(lastCourse._id.replace('LH', '')) : 0;
    this._id = `LH${lastId + 1}`;
  }
  next();
});

module.exports = mongoose.model('Course', CourseSchema);
