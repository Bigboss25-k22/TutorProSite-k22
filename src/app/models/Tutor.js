const mongoose = require("mongoose");
const AutoIncrement=require('mongoose-sequence')(mongoose);
const Schema = mongoose.Schema;


// Kích hoạt plugin slug


const TutorSchema = new Schema(
  {
    username: { type: String, required: true },
    name: { type: String, required: true },
    address: { type: String, required: true },
    introduction: { type: String, required: true }, // "Tôi là giáo viên toán cấp 3..."
    specialization: { type: String, required: true }, // "Toán học"
    rating: { type: Number, min: 0, max: 5 }, // Điểm đánh giá (4.8)
    status: {
      type: String,
      default: 'Chưa duyệt'
    },  // Trạng thái (Chưa duyệt, Đã duyệt)
    slug: { type: String  }, // Tạo slug từ username
  },
  {
    timestamps: true, 
  }
);

module.exports = mongoose.model("Tutor", TutorSchema);
