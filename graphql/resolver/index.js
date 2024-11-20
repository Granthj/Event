const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose');
const Razorpay = require('razorpay');
const Event = require('../../model/Event.js')
const User = require('../../model/User.js');
const Booking = require('../../model/booking.js');
const Customer = require('../../model/customer.js');
const { default: ObjectID } = require('bson-objectid');
// const { ObjectId } = require('mongodb');
// let ObjectID = require("bson-objectid");
let objectId = new mongoose.Types.ObjectId();
const razorpay = new Razorpay({
    key_id: 'rzp_test_u2a8oM3ko4mvF2',
    key_secret: 'FFZoe1Vpd6QMG5vzeXMkTULx'
  });
const events = async(eventId)=>{
    const event = await Event.find({_id:{$in:eventId}});
    return event.map(events =>{
        return {...events._doc,_id:events.id};
    })
};
const CancelBooking = async(bookings)=>{
    return bookings.map(result=>{
        return result.event
    })
    // console.log("Mango",promise)
    // return promise;   
} 
const bookedBy = async(Id)=>{
    const bookArray = await Customer.find({_id:{$in:Id}});
    return bookArray.map(result=>{
        return {...result._doc,_id:result.id}
    });
};
const singleEvent = async(eventId)=>{
    const event = await Event.findById(eventId);
    return{...event._doc}
}
const customer = (customerId)=>{
    if(customerId){
        return Customer.findById({_id:customerId}).then(customerEvent=>{
            return{...customerEvent._doc,_id:customerEvent.id}
        })
    }
    return Customer.find({}).then(customerEvent=>{
        return{...customerEvent._doc,_id:customerEvent.id}
    })
}   
const user =  (userId)=>{
    // const userEvent = await
    return User.findById({_id:userId}).then(userEvent=>{
        return {...userEvent._doc,createEvent:events.bind(this,userEvent._doc.createEvent),_id:userEvent.id}
    })
    // 
}
module.exports = {
customerBookedAnEvent:async (args,req)=>{
    const customerID = await Customer.findOne({email:req.email});
    const objectID = customerID._id;
    const objectIdString = objectID.toString(); 
    return {...customerID._doc}
},
paymentGateway:async(args,req,res)=>{
    if(req.auth){

        const event = await Event.findOne({_id:args.eventId});
        const eventID = event._id;
        const eventIdToString = eventID.toString();
        const options = {
            amount: event.price*100, // Amount in paise (50000 paise = ₹500)
            currency: 'INR',
            receipt: 'receipt#1',
            payment_capture: 1 // Auto capture payment after order creation
        };
        
        try{
            const order = await razorpay.orders.create(options)
            return {
                id: order.id,
                amount: order.amount,
                currency: order.currency,
                status: order.status
              };
        }
        catch(err){
        console.error('Error creating order:', err);
        res.status(500).send('Error creating order');
        }
    }
    
},
singleBooking:async (args,req)=>{
    let objectofBooking = {};
    let arrayofObject = [];
    const CustomerID = await Customer.findOne({email:req.email});
    const bookings = await Booking.find({customer:new mongoose.Types.ObjectId(`${CustomerID.id}`)});
    let arrayBookingId = await CancelBooking(bookings)
    
    const events = await Event.find({_id:{$in:arrayBookingId}});
    
    const eventArray = await events.map(customerBooking=>{
        return{...customerBooking._doc}
    })
    const bookingArray = await bookings.map(booking=>{
        return{...booking._doc}
    })
    for(let i = 0,j = 0;i < bookingArray.length,j < eventArray.length;i++,j++){
        objectofBooking[`_id`] = bookingArray[i]._id;
        objectofBooking[`event`] = bookingArray[i].event;
        objectofBooking[`title`] = eventArray[j].title
        arrayofObject.push(objectofBooking);
        objectofBooking = {};
    }
    return arrayofObject.map(result=>{
        return {...result}
    })

    

},    
customer:()=>{
    return Customer.find().then(customer=>{
        return customer.map(cust=>{
            return{...cust._doc,createEvent:events.bind(this,cust._doc.createEvent)}
        })
    })
},    
event:(args,req)=>{
    // if(req.auth){
    return Event.find().then(events=>{
        return events.map(event=>{
            return {...event._doc,bookedBy:bookedBy.bind(this,event._doc.bookedBy)}
        })
    })
// }
},
booking:async (args,req)=>{
    // if(req.auth){
    const allBooking = await Booking.find();
    return allBooking.map(book=>{
        return {...book._doc,_id:book.id,
            customer:customer.bind(this,book._doc.customer),
            createdAt:new Date(book._doc.createdAt).toISOString(),
            updatedAt:new Date(book._doc.updatedAt).toISOString()}
    })  
    // }
},
createEvent:(args,req)=>{
    // if(req.auth){
    const event = new Event({
        title:args.eventInput.title,
        price:args.eventInput.price,
        desc:args.eventInput.desc,
        date:args.eventInput.date,
    })
        let createdEvent;
        return event.save()
        .then(event=>{
            createdEvent = {...event._doc,_id:event._doc._id.toString(),bookedBy:bookedBy.bind(this,event._doc.bookedBy)}
            return User.findById(req.userId)
        }).then(user=>{
        if(!user){
            throw new Error("User not found");
        }
        return {...createdEvent};
            // user.createEvent.push(event);
            // return user.save();
          
        }); 
    // }
    // else
    //     throw new Error("You are not authorize")
},
createCustomer:async (args)=>{
    const bool = await Customer.find({email:args.customerInput.email});
    // console.log(args.customerInput.profile.split("blob:")[1],"profile")
    if(false){
        throw new Error("Customer Exists");
    }
    return bcrypt.hash(args.customerInput.password,12)
    .then(hashedPassword=>{
        const customer = new Customer({
            name:args.customerInput.name,
            email:args.customerInput.email,
            password:args.customerInput.password,
            // profile:args.customerInput.profile.split("blob:")[1]
        })
        return customer.save()
    })
    .then(result=>{
        return{...result._doc,createEvent:events.bind(result._doc.createEvent)};
    })
},
createUser:async (args)=>{
    const bool = await User.find({email:args.userInput.email});
    if(false){
        throw new Error("Email already exists");
    }
    return bcrypt.hash(args.userInput.password,12)
    .then(hashedPassword=>{
        const user = new User({
            email:args.userInput.email,
            password:hashedPassword
        })
        return user.save()
    })
    .then(result=>{
        return {...result._doc,createEvent:events.bind(result._doc.createEvent)}
    })
    .catch(err=>{
        throw err;
    })
   
},
addBooking:async (args,req)=>{
    // console.log(req.auth,"in Booking")
    // if(req.auth){
    const fetchEvent = await Event.findOne({_id:args.eventId})
    const fetchCustomer = req.customerId;
    const alreadyBooked = await Booking.findOne({event:fetchEvent,customer:fetchCustomer})
    if(alreadyBooked){
        console.log("its Booked Already");
        return;
    }
    const booking = new Booking({
        event:fetchEvent,
        customer:fetchCustomer
    });
    const result = await booking.save();

    const customers = await Customer.findById({_id:new mongoose.Types.ObjectId(`${req.customerId}`)});
    customers.createEvent.push(fetchEvent);
    const res = await customers.save();

    fetchEvent.bookedBy.push(customers);
    const eventResult = await fetchEvent.save();

    return {...result._doc,_id:result.id,
        event:singleEvent.bind(this,result._doc.event),
        bookedBy:bookedBy.bind(this,eventResult._doc.bookedBy),
        // user:user.bind(this,result._doc.user),
        customer:customer.bind(this,customers._id),
        createdAt:new Date(result._doc.createdAt).toISOString(),
        updatedAt:new Date(result._doc.updatedAt).toISOString()
    }

// }
},
cancelBooking:async (args,req)=>{
    // console.log("bella chao",args.bookingId)
    if(req.auth){
    const deletedBooking = await Booking.findOne({_id:args.bookingId});
    await Booking.deleteOne({_id:args.bookingId});
    console.log(deletedBooking.event,"pooo")  
    // const deletedEvent = await Booking.findById({_id:args.bookingId});
    // const event ={
    //     ...deletedEvent.event._doc,
    //     _id:deletedEvent.event.id,
    //     event:singleEvent.bind(this,deletedEvent._doc.event)
    // }
    const cancelCreateEvent = await Customer.findById({_id:req.customerId});
    const deleteEventFromCustomer = await Customer.findByIdAndUpdate(req.customerId,{$pull:{createEvent:`${deletedBooking}`}})
    // return {...deletedEvent.doc._id};
}
},

login:async ({email,password})=>{
    const customer = await Customer.findOne({email:email});
    if(!customer){
        throw Error('User not found');
    }
    // const isEqual = await bcrypt.compare(password,customer.password)
    // if(!isEqual) throw Error('Password is incorrect');
        
        const token = jwt.sign({customerId:customer.id,email:customer.email},'Iamgood',{
            expiresIn:'1h'
        });                                         
    return {CustomerId:customer.id,token:token,tokenExpiration:1,Email:customer.email}
    
},
adminLogin:async ({email,password})=>{
    const user = await User.findOne({email:email});
    console.log("ID",user.id)
    if(!user)
        throw Error("Invalidd Admin");
    const isEqual = await bcrypt.compare(password,user.password);
    if(!isEqual) throw Error("Invalid admin password");
    const token = jwt.sign({UserId:user.id,email:user.email},"GootAdmin",{
        expiresIn:'1h'
    })
    return{UserId:user.id,token:token,tokenExpiration:1}
}
};