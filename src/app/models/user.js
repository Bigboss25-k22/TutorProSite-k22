const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const slug = require("mongoose-slug-generator");

mongoose.plugin(slug);

const User = new Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  address: { type: String, required: true },
  slug: { type: String, slug: 'username', unique: true },
  role: { type: String, enum: ['parent',  'tutor'], required: true }, 
},  {
  timestamps: true, // Thêm trường createdAt và updatedAt
}
);

module.exports = mongoose.model('User', User);
