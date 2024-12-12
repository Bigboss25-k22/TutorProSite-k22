const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const RatingSchema = new Schema(
  {
    tutorId: { type: Number, required: true, ref: "Tutor" }, // ID của gia sư
    parentId: { type: Number, required: true, ref: "Parent" }, // ID của phụ huynh
    rating: { type: Number, required: true, min: 0, max: 5 }, // Điểm đánh giá từ 0 đến 5
    comment: { type: String }, // Bình luận
  },
  {
    timestamps: true, // Thêm `createdAt` và `updatedAt`
  }
);

module.exports = mongoose.model("Rating", RatingSchema);
