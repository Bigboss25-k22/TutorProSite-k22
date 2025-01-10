const mongoose = require("mongoose");
const AutoIncrement = require('mongoose-sequence')(mongoose);

const Schema = mongoose.Schema;
var slug = require('mongoose-slug-generator');

mongoose.plugin(slug);
const slugify = require("slugify");


const CourseSchema = new Schema({
  _id: { type: Number },           // ID khóa học
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
  sexTutor: { type: String, required: true },    
  fee:{type :Number,require:true},
  status: {
    type: String,
    default: 'Chưa duyệt'
  },
  slug: { type: String ,unique:true},
}, {
  //_id: false,
  timestamps: true, // Tự động thêm createdAt và updatedAt
});

// Pre-save hook to generate custom _id

CourseSchema.plugin(AutoIncrement, { id: 'course_seq', inc_field: '_id' });

CourseSchema.pre("save", async function (next) {
  if (this.isNew || this.isModified("subject")) {
    const baseSlug = slugify(this.subject, { lower: true });
    let slug = baseSlug;
    let counter = 1;

    // Kiểm tra trùng lặp slug trong mô hình Course
    while (await mongoose.models.Course.exists({ slug, _id: { $ne: this._id } })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    this.slug = slug;
  }
  next();
});

module.exports = mongoose.model('Course', CourseSchema);
