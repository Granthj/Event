const mongoose = require('mongoose');
const schema = mongoose.Schema;

const bookSchema = new schema({
    customer:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Customer',
        required:true
    },
    event:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Event',
        required:true
    }
},
{timestamps:true}
);

module.exports = mongoose.model('Booking',bookSchema);