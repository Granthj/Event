const mongoose = require('mongoose');
const schema = mongoose.Schema;

const bookSchema = new schema({
    customer:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Customer'
    },
    event:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Event'
    }
},
{timestamps:true}
);

module.exports = mongoose.model('Booking',bookSchema);