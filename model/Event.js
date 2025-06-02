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
    city:{
        type:String,
        required:true
    },
    state:{
        type:String,
        required:true
    },
    address:{
        type:String,
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