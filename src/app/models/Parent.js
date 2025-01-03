const mongoose = require('mongoose');


const ParentSchema = new mongoose.Schema({

    _id: { type: Number },
    name: { type: String, required: true },
    address: { type: String, required: true },
    phoneNumber: { type: String },
    slug: { type: String  }, 
},
{
    timestamps:true,
}
);

module.exports = mongoose.model('Parent', ParentSchema);
