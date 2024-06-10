const mongoose = require('mongoose');
const schema = mongoose.Schema;

const Customer = new schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    // profile:{
    //     type:String,
    //     required:true
    // },
    createEvent:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'Event'
        }
    ]
});
module.exports = mongoose.model('Customer',Customer);