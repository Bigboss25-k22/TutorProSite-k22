const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const slug = require("mongoose-slug-generator");

const User = new Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  dob: { type: Date, required: true },
  email: { type: String, required: true, unique: true },
  address: { type: String, required: true },
  slug: { type: String, slug: 'name', unique: true },
  role: { type: String, enum: ['student', 'tuto'], required: true },
  student: {
    class: { type: String },
    school: { type: String },
    student_card_image: { type: String }
  },
  tuto: {
    education_level: { type: String, enum: ['student', 'teacher'] },
    degree_image: { type: String },
    subjects: [{ type: String }]
  }
}, {
  timestamps: true
});

module.exports = mongoose.model( 'User', User);