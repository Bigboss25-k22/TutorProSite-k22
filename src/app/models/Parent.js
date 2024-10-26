const mongoose = require('mongoose');

const parentSchema = new mongoose.Schema({
    parent_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    username: { type: String, required: true },
    address: { type: String, required: true },
    phone_number: { type: String }
});

module.exports = mongoose.model('Parent', parentSchema);
