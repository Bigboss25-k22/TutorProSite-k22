const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const slug = require("mongoose-slug-generator");

// Kích hoạt plugin slug
mongoose.plugin(slug);

const TutorSchema = new Schema(
  {
    tutor_id: { type: Number, required: true }, // ID của gia sư
    username: { type: String, required: true }, // "nguyenvanb"
    introduction: { type: String, required: true }, // "Tôi là giáo viên toán cấp 3..."
    specialization: { type: String, required: true }, // "Toán học"
    rating: { type: Number, min: 0, max: 5 }, // Điểm đánh giá (4.8)
    slug: { type: String,   }, // Tạo slug từ username
  },
  {
    timestamps: true, // Thêm trường createdAt và updatedAt
  }
);

module.exports = mongoose.model("Tutor", TutorSchema);
