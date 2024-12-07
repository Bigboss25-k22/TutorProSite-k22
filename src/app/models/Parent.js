const mongoose = require('mongoose');
const AutoIncrement=require('mongoose-sequence')(mongoose);

const ParentSchema = new mongoose.Schema({

   
    name: { type: String, required: true },
    address: { type: String, required: true },
    phone_number: { type: String },
    slug: { type: String  }, 
},
{
    timestamps:true,
}
);

module.exports = mongoose.model('Parent', ParentSchema);
