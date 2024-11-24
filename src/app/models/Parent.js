const mongoose = require('mongoose');
const AutoIncrement=require('mongoose-sequence')(mongoose);

const ParentSchema = new mongoose.Schema({

    _id:{type: Number},
    name: { type: String, required: true },
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    address: { type: String, required: true },
    phone_number: { type: String },
    slug: { type: String  }, 
},
{
    _id: false,
    timestamps:true,
}
);

module.exports = mongoose.model('Parent', ParentSchema);
