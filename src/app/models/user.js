const mongoose = require("mongoose");
const AutoIncrement=require('mongoose-sequence')(mongoose);
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  _id: { type: Number },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  address: { type: String, required: true },
  role: { type: String, enum: ['parent', 'tutor'], required: true },
  slug: { type: String  }, // Tạo slug từ username
}, {
  _id: false,
  timestamps: true, // Thêm trường createdAt và updatedAt
});

// CourseSchema.pre('save', function (next) {
//   if (this.isModified('subject')) { // Chỉ tạo lại slug khi 'subject' thay đổi
//     this.slug = slugify(this.subject, { lower: true, strict: true });
//   }
//   next();
// });

UserSchema.plugin(AutoIncrement);




module.exports = mongoose.model('User', UserSchema);