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
const getcartId = async(response)=>{
    const eventObjId = new mongoose.Types.ObjectId(response.cart[0].eventId );
    const matched = response.cart.find(item => item.eventId.toString() === eventObjId.toString());
    return matched._id;  
}
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
    console.log("EventBooked",req.auth,req.customerId,req.email)
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
    let arrayEventId = await CancelBooking(bookings)
    const ids = arrayEventId.map(item => item.eventId);
    const events = await Event.find({_id:{$in:arrayEventId}});
    // const eventArray = await Event.find({ _id: { $in: ids } });
    
    const sortedEvents = ids.map(id => events.find(event => event._id.toString() === id));
    const eventArray = await sortedEvents.map(customerBooking=>{
        return{customerBooking}
    })
    // const bookingArray = await bookings.map(booking=>{
    //     return{...booking._doc}
    // })
    console.log(eventArray,"khguhg")

    for(let i = 0;i < eventArray.length;i++){
        objectofBooking[`_id`] = eventArray[i]._id;
        objectofBooking[`title`] = eventArray[i].title
        // objectofBooking[`event`] = eventArray[i].event;
        objectofBooking[`price`] = eventArray[i].price
        objectofBooking[`desc`] = eventArray[i].desc
        objectofBooking[`date`] = eventArray[i].date
        arrayofObject.push(objectofBooking);
        objectofBooking = {};
    }
    return arrayofObject.map(result=>{
        return {...result}
    })

    

},    
customer:async()=>{
    return Customer.find().then(customer=>{
        return customer.map(cust=>{
            return{...cust._doc,createEvent:events.bind(this,cust._doc.createEvent)}
        })
    })
},    
event:(args,req)=>{
    // console.log("THIS IS AUTHBHHJVYHV",req.auth,req.customerId)
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
    const hashedPassword = await bcrypt.hash(args.customerInput.password, 12);
     const customer = new Customer({
      firstname: args.customerInput.firstname,
      lastname: args.customerInput.lastname,
      dob: args.customerInput.dob,
      gender: args.customerInput.gender,
      email: args.customerInput.email,
      password: hashedPassword,
    });
    const result = await customer.save();
    // console.log("HIT HERE",result)
   
    return{...result._doc,createEvent:events.bind(result._doc.createEvent)};
},
cartEvent:async (args,req)=>{

    const customerData = await Customer.findById(args.cartInput.customerId);
    const alreadyInCart = customerData.cart.find(item => item.eventId.toString() === args.cartInput.eventId.toString());
    if(alreadyInCart){
        console.log("Already in cart")
        return;
    }
    customerData.cart.push({
        eventId:args.cartInput.eventId
    })
    const response = await customerData.save();
    if(response){
        const eventData = await Event.findById(args.cartInput.eventId);
        const cartId = await getcartId(response);
        if(cartId){
            return {...eventData._doc,_id:cartId,eventId:eventData._id,customerId:response._id,}
        }
    }
},
cartEventDelete:async (args,req)=>{
    const customerData = await Customer.findById(args.cartCancelInput.customerId);
    const cartid = customerData.cart.find(item => item._id.toString() === args.cartCancelInput.cartId);
    if(!cartid){
        console.log("Not in cart")
        return;
    }
    const eventData = await Event.findById(cartid.eventId);
    customerData.cart.pull(cartid);
    const response = await customerData.save();
    if(response){
        return {...eventData._doc,_id:cartid._id,eventId:eventData._id,customerId:response._id,}
    }
},
getCart:async (args,req)=>{
    const customerData = await Customer.findById(args.customerId);
    const cartArray = customerData.cart.map(cart=>{
        return{eventId:cart.eventId,_id:cart._id}
    })
    // console.log(cartArray,"cartArray")
    const ids = cartArray.map(item => item.eventId);
    // console.log(ids,"ids")
    const eventArray = await Event.find({ _id: { $in: ids } });
    const sortedEvents = ids.map(id => eventArray.find(event => event._id.toString() === id.toString()));
    // console.log(sortedEvents,"sorted")
    // const eventObj = await eventArray.map(event=>{
    //     return{...event._doc}
    // })
    // console.log(eventObj,"eventObj")
    let arrayofObject = []
    let objectofBooking = {};
    for(let i = 0;i < cartArray.length;i++){
        objectofBooking[`_id`] = cartArray[i]._id;
        objectofBooking[`eventId`] = cartArray[i].eventId;
        objectofBooking[`title`] = sortedEvents[i].title
        objectofBooking[`price`] = sortedEvents[i].price
        objectofBooking[`desc`] = sortedEvents[i].desc
        objectofBooking[`date`] = sortedEvents[i].date
        arrayofObject.push(objectofBooking);
        objectofBooking = {};
    }
    // console.log(arrayofObject,"arrayofObject")
    return arrayofObject.map(result=>{
        return {...result}
    })
},
customerBooking:async (args)=>{
    let array = [];
    let object = [];
    const customerData = await Customer.findById(args.customerId);
    const bookings = await Booking.find({customer:new mongoose.Types.ObjectId(`${args.customerId}`)});

    const eventIds = bookings.map(item => item.event);
    const events = await Event.find({ _id: { $in: eventIds } });
    const result = bookings.map(book => {
            return events.find(eventid=> 
                eventid._id.toString() === book.event.toString()
     )});
    for(let i = 0;i < result.length;i++){
        object[`_id`] = result[i]._id;
        object[`title`] = result[i].title;
        object[`price`] = result[i].price;
        object[`desc`] = result[i].desc;
        object[`date`] = result[i].date;
        object[`bookingId`] = bookings[i]._id;
        object[`createdAt`] = bookings[i].createdAt
        array.push(object);
        object = {};
    }
    return array.map(obj=>{
        return {...obj}
    })
},
customerData:async (args,req)=>{
    const customerinfo = await Customer.findOne({_id:args.customerId});
    console.log(customerinfo,"abcd")
    // return {firstname:customerinfo.firstname,lastname:customerinfo.lastname,dob:customerinfo.dob,
    //     gender:customerinfo.gender,email:customerinfo.email,password:customerinfo.password
    // }
    return {...customerinfo._doc}
},
updateCustomerData:async (args,req)=>{
    let updateObj = {};
    const customerPassword = await Customer.findOne({_id:args.updateCustomerInput.customerId});
    const isEqual = await bcrypt.compare(args.updateCustomerInput.password,customerPassword.password);
    if(!isEqual) throw new Error('Incorrect current password');
    if(args.updateCustomerInput.newPassword !== '' && args.updateCustomerInput.newPassword !== args.updateCustomerInput.password){
        const updatedPassword = await bcrypt.hash(args.updateCustomerInput.newPassword,12);
        console.log(args.updateCustomerInput.newPassword,"newPassword")
        updateObj = {
            firstname:args.updateCustomerInput.firstname,
            lastname:args.updateCustomerInput.lastname,
            dob:args.updateCustomerInput.dob,
            gender:args.updateCustomerInput.gender,
            email:args.updateCustomerInput.email,
            // password:args.updateCustomerInput.newPassword
            password:updatedPassword
        }
    }
    else{
        console.log(args.updateCustomerInput.password,"oldPassword")
        const password = await bcrypt.hash(args.updateCustomerInput.password,12);
        updateObj={
            firstname:args.updateCustomerInput.firstname,
            lastname:args.updateCustomerInput.lastname,
            dob:args.updateCustomerInput.dob,
            gender:args.updateCustomerInput.gender,
            email:args.updateCustomerInput.email,
            password:password
        }
    }
    const customerData = await Customer.findByIdAndUpdate(
        args.updateCustomerInput.customerId,
        updateObj,
        { new: true, runValidators: true }
    );
    if (!customerData) {
        throw new Error('Customer not found');
    }
    return customerData;
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
    const fetchEvent = await Event.findOne({_id:args.createBooking.eventId});
    // const fetchCustomer = await Customer.findOne({_id:args.createBooking.customerId});
    const fetchCustomer = req.customerId;
    console.log(req.customerId,"customerId")
    console.log(fetchEvent._id,"eventId")
    console.log(fetchCustomer,"customerId")
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

    // const customers = await Customer.findById({_id:new mongoose.Types.ObjectId(`${fetchCustomer._id}`)});
    const customers = await Customer.findById({_id:fetchCustomer});
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
    console.log("CUSTOMER",customer.password)
    if(!customer){
        throw Error('User not found');
    }
    const isEqual = await bcrypt.compare(password,customer.password)
    console.log("INSIDE LOGINN",isEqual)
    if(!isEqual) return ;
        
        const token = jwt.sign({customerId:customer.id,email:customer.email},'Iamgood',{
            expiresIn:'1h'
        });  
        // const decoded = jwt.decode(token);
        // if (!decoded) {
        //     throw Error('Failed to decode JWT');
        // }                                       
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