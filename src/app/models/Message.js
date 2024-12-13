const mongoose = require("mongoose");
const Schema = mongoose.Schema;
var slug = require('mongoose-slug-generator');

mongoose.plugin(slug);

const MessageSchema = new Schema({
    _id: { type: Number },
    senderId: {
        type: Number,
        required: true
    },
    receiverId: {
        type: Number,
        required: true
    },
    content: {
        type: String,
        required: true,
        trim: true
    },
    slug: {
        type: String,
       
        unique: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    },
    chatRoomId: { type: String, required: true }, // ID của phòng chat
    isRead: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

// Pre-save hook to generate custom _id and slug
MessageSchema.pre('save', async function (next) {
    if (this.isNew) {
        // Generate _id
        const lastMessage = await mongoose.model('Message').findOne().sort({ _id: -1 });
        const lastId = lastMessage ? parseInt(lastMessage._id) : 0;
        this._id = `${lastId + 1}`;
    }

    // Generate slug if not already set
    if (!this.slug) {
        const slugify = require('slugify');
        this.slug = slugify(`${this._id}-${this.senderId}`, { lower: true });
    }

    next();
});

module.exports = mongoose.model('Message', MessageSchema);
