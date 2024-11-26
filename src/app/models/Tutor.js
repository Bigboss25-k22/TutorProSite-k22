const mongoose = require("mongoose");
const AutoIncrement=require('mongoose-sequence')(mongoose);
const Schema = mongoose.Schema;
var slug = require('mongoose-slug-generator');

mongoose.plugin(slug);

// Kích hoạt plugin slug


const slugify = require("slugify");

const TutorSchema = new Schema(
  {
    _id: { type: Number },
    name: { type: String, required: true },
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    address: { type: String, required: true },
    introduction: { type: String, required: true },
    specialization: { type: String, required: true },
    rating: { type: Number, min: 0, max: 5 },
    slug: { type: String, unique: true },
    status: {
      type: String,
      default: 'Chưa duyệt'
    },  // Trạng thái (Chưa duyệt, Đã duyệt)
  },
  {
    timestamps: true,
  }
);

// Middleware để tạo slug trước khi lưu
TutorSchema.pre("save", async function (next) {
  if (this.isNew || this.isModified("name")) {
    const baseSlug = slugify(this.name, { lower: true });
    let slug = baseSlug;
    let counter = 1;

    // Kiểm tra trùng lặp slug
    while (await mongoose.models.Tutor.exists({ slug })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    this.slug = slug;
  }
  next();
});


module.exports = mongoose.model("Tutor", TutorSchema);


