const mongoose = require('mongoose');
const schema = mongoose.Schema;

const User = new schema({
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    // createEvent:[
    //     {
    //         type:mongoose.Schema.Types.ObjectId,
    //         ref:'Event'
    //     }
    // ]
});

module.exports = mongoose.model('User',User);