const mongoose = require("mongoose");
const slug = require('mongoose-slug-generator'); 
const AutoIncrement = require('mongoose-sequence')(mongoose);
const Schema = mongoose.Schema;

// Kích hoạt plugin slug trong mongoose
mongoose.plugin(slug);

const UserSchema = new Schema({
  _id: { type: Number },
 
  password: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  role: { type: String, enum: ['parent', 'tutor'], required: true },
  slug: { type: String}, 
}, {
  timestamps: true, 
});

// Tự động tăng _id
UserSchema.plugin(AutoIncrement, { id: 'user_seq', inc_field: '_id' });

module.exports = mongoose.model('User', UserSchema);
