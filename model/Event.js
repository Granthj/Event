const mongoose = require('mongoose');
const schema = mongoose.Schema;

const Event = new schema({
    title:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    desc:{
        type:String,
        required:true
    },
    date:{
        type:Date,
        required:true
    },
    // creator:{
    //     type:mongoose.Schema.Types.ObjectId,
    //     ref:'User'
    // }
    bookedBy:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'Customer'
        }
    ]
});

const Events = mongoose.model('Event',Event);

module.exports = Events;