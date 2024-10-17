const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const User = new Schema({
  username: { type: String, required: true },
  password: { type: String },
  email: { type: String},
},{
  timestamps: true,
});

module.exports = mongoose.model( 'User', User);