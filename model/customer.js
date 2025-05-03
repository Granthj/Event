const mongoose = require('mongoose');
const Cart = require('./cart');
const schema = mongoose.Schema;

const Customer = new schema({
    firstname:{
        type:String,
        required:true
    },
    lastname:{
        type:String,
        required:true
    },
    dob:{
        type:Date,
        required:true
    },
    gender:{
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
    createEvent:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'Event'
        }
    ],
    cart:[Cart]
});
module.exports = mongoose.model('Customer',Customer);