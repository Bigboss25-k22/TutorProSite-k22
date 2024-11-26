const mongoose = require("mongoose");
const slug = require('mongoose-slug-generator'); 
const AutoIncrement = require('mongoose-sequence')(mongoose);
const Schema = mongoose.Schema;

// Kích hoạt plugin slug trong mongoose
mongoose.plugin(slug);

const UserSchema = new Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  role: { type: String, enum: ['parent', 'tutor'], required: true },
  slug: { type: String}, 
}, {
  _id: false,
  timestamps: true, 
});

module.exports = mongoose.model('User', UserSchema);
