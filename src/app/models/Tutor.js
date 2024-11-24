const mongoose = require("mongoose");
const AutoIncrement=require('mongoose-sequence')(mongoose);
const Schema = mongoose.Schema;


// Kích hoạt plugin slug


const TutorSchema = new Schema(
  {
    _id: { type: Number }, // ID của gia sư
    name: { type: String, required: true },
    username: { type: String, required: true }, // "nguyenvanb",
    email: { type: String, required: true, unique: true },
    address: { type: String, required: true },
    introduction: { type: String, required: true }, // "Tôi là giáo viên toán cấp 3..."
    specialization: { type: String, required: true }, // "Toán học"
    rating: { type: Number, min: 0, max: 5 }, // Điểm đánh giá (4.8)
    slug: { type: String  }, // Tạo slug từ username
  },
  {
    _id: false,
    timestamps: true, 
  }
);

module.exports = mongoose.model("Tutor", TutorSchema);
