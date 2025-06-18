const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose');
const Razorpay = require('razorpay');
const crypto = require('crypto');
const otpGenerator = require('otp-generator');
require('dotenv').config();
const transporter = require('../../utils/nodemailer.js');
const Event = require('../../model/Event.js')
const User = require('../../model/User.js');
const Booking = require('../../model/booking.js');
const Customer = require('../../model/customer.js');
const Otp = require('../../model/Otp.js');
const PasswordResetSession = require('../../model/SessionToken.js');
const { default: ObjectID } = require('bson-objectid');
// const { ObjectId } = require('mongodb');
// let ObjectID = require("bson-objectid");
let objectId = new mongoose.Types.ObjectId();
const razorpay = new Razorpay({
<<<<<<< HEAD
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
=======
    key_id: 'rzp_test_u2a8oM3ko4mvF2',
    key_secret: 'FFZoe1Vpd6QMG5vzeXMkTULx'
>>>>>>> 582eafcfd1d70d483a7b9d52e8fb5034bd4ae280
});
const OtpSameCode = async (customerEmail, value) => {
    const otp = otpGenerator.generate(4, {
        digits: true,
        upperCaseAlphabets: false,
        lowerCaseAlphabets: false,
        specialChars: false,
    });
    const expiresAt = new Date(Date.now() + 1 * 60 * 1000);
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: customerEmail,
<<<<<<< HEAD
        subject: `'Your OTP Code' +  ${new Date().toLocaleTimeString()}`,
=======
        subject: 'Your OTP Code',
>>>>>>> 582eafcfd1d70d483a7b9d52e8fb5034bd4ae280
        text: `Your OTP code for ${value} is ${otp}. It will expire in 1 minutes.`,
    };
    const otpDb = new Otp({
        email: customerEmail,
        code: otp,
        expiresAt: expiresAt,
        ttlAt: new Date(Date.now() + 30 * 60 * 1000),
    })
    await otpDb.save();
<<<<<<< HEAD
    const response = await transporter.sendMail(mailOptions);
    console.log(response,'email')
=======
    await transporter.sendMail(mailOptions);
>>>>>>> 582eafcfd1d70d483a7b9d52e8fb5034bd4ae280
}
const events = async (eventId) => {
    const event = await Event.find({ _id: { $in: eventId } });
    return event.map(events => {
        return { ...events._doc, _id: events.id };
    })
};
const getcartId = async (response) => {
    const eventObjId = new mongoose.Types.ObjectId(response.cart[0].eventId);
    const matched = response.cart.find(item => item.eventId.toString() === eventObjId.toString());
    return matched._id;
}
const CancelBooking = async (bookings) => {
    return bookings.map(result => {
        return result.event
    })
}
const bookedBy = async (Id) => {
    const bookArray = await Customer.find({ _id: { $in: Id } });
    return bookArray.map(result => {
        return { ...result._doc, _id: result.id }
    });
};
const singleEvent = async (eventId) => {
    const event = await Event.findById(eventId);
    return { ...event._doc }
}
const customer = (customerId) => {
    if (customerId) {
        return Customer.findById({ _id: customerId }).then(customerEvent => {
            return { ...customerEvent._doc, _id: customerEvent.id }
        })
    }
    return Customer.find({}).then(customerEvent => {
        return { ...customerEvent._doc, _id: customerEvent.id }
    })
}
const user = (userId) => {
    // const userEvent = await
    return User.findById({ _id: userId }).then(userEvent => {
        return { ...userEvent._doc, createEvent: events.bind(this, userEvent._doc.createEvent), _id: userEvent.id }
    })
    // 
}
module.exports = {
    customerBookedAnEvent: async (args, req) => {
        const customerID = await Customer.findOne({ email: req.email });
        const objectID = customerID._id;
        const objectIdString = objectID.toString();
        return { ...customerID._doc }
    },
<<<<<<< HEAD
    paymentGateway: async (args,context) => {
        const { req, res } = context;
=======
    paymentGateway: async (args, req, res) => {
>>>>>>> 582eafcfd1d70d483a7b9d52e8fb5034bd4ae280
        if (req.auth) {

            const event = await Event.findOne({ _id: args.eventId });
            const eventID = event._id;
            const eventIdToString = eventID.toString();
            const options = {
                amount: event.price * 100, // Amount in paise (50000 paise = ₹500)
                currency: 'INR',
                receipt: 'receipt#1',
                payment_capture: 1 // Auto capture payment after order creation
            };

            try {
                const order = await razorpay.orders.create(options)
                return {
                    id: order.id,
                    amount: order.amount,
                    currency: order.currency,
                    status: order.status
                };
            }
            catch (err) {
                res.status(500).send('Error creating order');
            }
        }

    },
    singleBooking: async (args, req) => {
        let objectofBooking = {};
        let arrayofObject = [];
        const CustomerID = await Customer.findOne({ email: req.email });
        const bookings = await Booking.find({ customer: new mongoose.Types.ObjectId(`${CustomerID.id}`) });
        let arrayEventId = await CancelBooking(bookings)
        const ids = arrayEventId.map(item => item.eventId);
        const events = await Event.find({ _id: { $in: arrayEventId } });
        // const eventArray = await Event.find({ _id: { $in: ids } });

        const sortedEvents = ids.map(id => events.find(event => event._id.toString() === id));
        const eventArray = await sortedEvents.map(customerBooking => {
            return { customerBooking }
        })

        for (let i = 0; i < eventArray.length; i++) {
            objectofBooking[`_id`] = eventArray[i]._id;
            objectofBooking[`title`] = eventArray[i].title
            // objectofBooking[`event`] = eventArray[i].event;
            objectofBooking[`price`] = eventArray[i].price
            objectofBooking[`desc`] = eventArray[i].desc
            objectofBooking[`date`] = eventArray[i].date
            arrayofObject.push(objectofBooking);
            objectofBooking = {};
        }
        return arrayofObject.map(result => {
            return { ...result }
        })



    },
    customer: async () => {
        return Customer.find().then(customer => {
            return customer.map(cust => {
                return { ...cust._doc, createEvent: events.bind(this, cust._doc.createEvent) }
            })
        })
    },
    event: (args, req) => {
        // if(req.auth){
        return Event.find().then(events => {
            return events.map(event => {
                return { ...event._doc, bookedBy: bookedBy.bind(this, event._doc.bookedBy) }
            })
        })
        // }
    },
    booking: async (args, req) => {
        // if(req.auth){
        const allBooking = await Booking.find();
        return allBooking.map(book => {
            return {
                ...book._doc, _id: book.id,
                customer: customer.bind(this, book._doc.customer),
                createdAt: new Date(book._doc.createdAt).toISOString(),
                updatedAt: new Date(book._doc.updatedAt).toISOString()
            }
        })
        // }
    },
    createEvent: (args, req) => {
        // if(req.auth){
        const event = new Event({
            title: args.eventInput.title,
            price: args.eventInput.price,
            desc: args.eventInput.desc,
            date: args.eventInput.date,
            city: args.eventInput.city,
            state: args.eventInput.state,
            address: args.eventInput.address,
<<<<<<< HEAD
            image:args.eventInput.image
=======
>>>>>>> 582eafcfd1d70d483a7b9d52e8fb5034bd4ae280
        })
        let createdEvent;
        return event.save()
            .then(event => {
                createdEvent = { ...event._doc, _id: event._doc._id.toString(), bookedBy: bookedBy.bind(this, event._doc.bookedBy) }
                return User.findById(req.userId)
            }).then(user => {
                if (!user) {
                    throw new Error("User not found");
                }
                return { ...createdEvent };
                // user.createEvent.push(event);
                // return user.save();

            });
        // }
        // else
        //     throw new Error("You are not authorize")
    },
    createCustomer: async (args) => {
        const bool = await Customer.find({ email: args.customerInput.email });
        console.log(bool, args.customerInput.email, "bool");
        if (bool.length > 0) {
            throw new Error("Email already exists");
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

        return { ...result._doc, createEvent: events.bind(result._doc.createEvent) };
    },
    cartEvent: async (args, req) => {
        const customerData = await Customer.findById(args.cartInput.customerId);
        const alreadyInCart = customerData.cart.find(item => item.eventId.toString() === args.cartInput.eventId.toString());
        if (alreadyInCart) {
            // console.log("BACKEND")
            return;
        }
        customerData.cart.push({
            eventId: args.cartInput.eventId
        })
        const response = await customerData.save();
        if (response) {
            const eventData = await Event.findById(args.cartInput.eventId);
            const cartId = await getcartId(response);
            if (cartId) {
                return { ...eventData._doc, _id: cartId, eventId: eventData._id, customerId: response._id, }
            }
        }
    },
<<<<<<< HEAD
    cartEventDelete: async (args, context) => {
        const { req } = context;
        if (!req.auth) {
            throw new Error("You are not authenticated");
        }
=======
    cartEventDelete: async (args, req) => {
>>>>>>> 582eafcfd1d70d483a7b9d52e8fb5034bd4ae280
        const customerData = await Customer.findById(args.cartCancelInput.customerId);
        const cartid = customerData.cart.find(item => item._id.toString() === args.cartCancelInput.cartId);
        if (!cartid) {
            return;
        }
        const eventData = await Event.findById(cartid.eventId);
        customerData.cart.pull(cartid);
        const response = await customerData.save();
        if (response) {
            return { ...eventData._doc, _id: cartid._id, eventId: eventData._id, customerId: response._id, }
        }
    },
<<<<<<< HEAD
    getCart: async (args, context) => {
        const { req } = context;
        if (!req.auth) {
            throw new Error("You are not authenticated");
        }
=======
    getCart: async (args, req) => {
>>>>>>> 582eafcfd1d70d483a7b9d52e8fb5034bd4ae280
        const customerData = await Customer.findById(args.customerId);
        const cartArray = customerData.cart.map(cart => {
            return { eventId: cart.eventId, _id: cart._id }
        })

        const ids = cartArray.map(item => item.eventId);
        const eventArray = await Event.find({ _id: { $in: ids } });
        const sortedEvents = ids.map(id => eventArray.find(event => event._id.toString() === id.toString()));

        let arrayofObject = []
        let objectofBooking = {};
        for (let i = 0; i < cartArray.length; i++) {
            objectofBooking[`_id`] = cartArray[i]._id;
            objectofBooking[`eventId`] = cartArray[i].eventId;
            objectofBooking[`title`] = sortedEvents[i].title
            objectofBooking[`price`] = sortedEvents[i].price
            objectofBooking[`desc`] = sortedEvents[i].desc
            objectofBooking[`date`] = sortedEvents[i].date
            objectofBooking[`city`] = sortedEvents[i].city
<<<<<<< HEAD
            objectofBooking[`state`] = sortedEvents[i].state
            objectofBooking[`address`] = sortedEvents[i].address
            objectofBooking[`image`] = sortedEvents[i].image
            arrayofObject.push(objectofBooking);
            objectofBooking = {};
        }
=======
            objectofBooking[`address`] = sortedEvents[i].address
            arrayofObject.push(objectofBooking);
            objectofBooking = {};
        }

>>>>>>> 582eafcfd1d70d483a7b9d52e8fb5034bd4ae280
        return arrayofObject.map(result => {
            return { ...result }
        })
    },
<<<<<<< HEAD
    customerBooking: async (args,context) => {
        const { req } = context;
        if (!req.auth) {
            throw new Error("You are not authenticated");
        }
=======
    customerBooking: async (args) => {
>>>>>>> 582eafcfd1d70d483a7b9d52e8fb5034bd4ae280
        let array = [];
        let object = [];
        const customerData = await Customer.findById(args.customerId);
        const bookings = await Booking.find({ customer: new mongoose.Types.ObjectId(`${args.customerId}`) });

        const eventIds = bookings.map(item => item.event);
        const events = await Event.find({ _id: { $in: eventIds } });
        const result = bookings.map(book => {
            return events.find(eventid =>
                eventid._id.toString() === book.event.toString()
            )
        });
        for (let i = 0; i < result.length; i++) {
            object[`_id`] = result[i]._id;
            object[`title`] = result[i].title;
            object[`price`] = result[i].price;
            object[`desc`] = result[i].desc;
            object[`date`] = result[i].date;
<<<<<<< HEAD
            object[`image`] = result[i].image;
            object[`city`] = result[i].city;
            object[`state`] = result[i].state;
            object[`address`] = result[i].address;
=======
>>>>>>> 582eafcfd1d70d483a7b9d52e8fb5034bd4ae280
            object[`bookingId`] = bookings[i]._id;
            object[`createdAt`] = bookings[i].createdAt
            array.push(object);
            object = {};
        }
        return array.map(obj => {
            return { ...obj }
        })
    },
<<<<<<< HEAD
    customerData: async (args, context) => {
        const { req } = context;
        if (!req.auth) {
            throw new Error("You are not authenticated");
        }
        const customerinfo = await Customer.findOne({ _id: args.customerId });
        return { ...customerinfo._doc }
    },
    updateCustomerData: async (args, context) => {
        const { req } = context;
        if (!req.auth) {
            throw new Error("You are not authenticated");
        }
=======
    customerData: async (args, req) => {
        const customerinfo = await Customer.findOne({ _id: args.customerId });
        return { ...customerinfo._doc }
    },
    updateCustomerData: async (args, req) => {
>>>>>>> 582eafcfd1d70d483a7b9d52e8fb5034bd4ae280
        let updateObj = {};
        const customerPassword = await Customer.findOne({ _id: args.updateCustomerInput.customerId });
        const isEqual = await bcrypt.compare(args.updateCustomerInput.password, customerPassword.password);
        if (!isEqual) throw new Error('Incorrect current password');
        if (args.updateCustomerInput.newPassword !== '' && args.updateCustomerInput.newPassword !== args.updateCustomerInput.password) {
            const updatedPassword = await bcrypt.hash(args.updateCustomerInput.newPassword, 12);
            updateObj = {
                firstname: args.updateCustomerInput.firstname,
                lastname: args.updateCustomerInput.lastname,
                dob: args.updateCustomerInput.dob,
                gender: args.updateCustomerInput.gender,
                // email: args.updateCustomerInput.email,
                password: updatedPassword
            }
        }
        else {
            const password = await bcrypt.hash(args.updateCustomerInput.password, 12);
            updateObj = {
                firstname: args.updateCustomerInput.firstname,
                lastname: args.updateCustomerInput.lastname,
                dob: args.updateCustomerInput.dob,
                gender: args.updateCustomerInput.gender,
                // email: args.updateCustomerInput.email,
                password: password
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
    sendOtp: async (args) => {
        const customerEmail = args.email;
        const emailExist = await Customer.findOne({ email: customerEmail });
        if (!emailExist) {
            throw new Error('Email not found');
        }
        const value = "forgot password"
        OtpSameCode(customerEmail, value);
        return 'otp sent successfully';

    },
    sendOtpforNewEmail: async (args) => {
        const customerEmail = args.email;
        const emailExist = await Customer.findOne({ email: customerEmail });
        if (emailExist) {
            throw new Error('Email already used!');
        }
        const value = "update email"
        OtpSameCode(customerEmail, value);
        return 'otp sent successfully';

    },
    sendOtpNewAccount: async (args) => {
        const customerEmail = args.email;
        const emailExist = await Customer.findOne({ email: customerEmail });
        if (emailExist) {
            throw new Error('Email already used!');
        }
        const value = "to create account"
        OtpSameCode(customerEmail, value);
        return 'otp sent successfully';
    },
    verifyOtp: async (args) => {
        const sessionStore = new Map();
        const { otp, email } = args;
        const otpData = await Otp.findOne({ email: email, code: otp });

        if (!otpData) {
            throw new Error('Invalid OTP');
        }
        if (otpData.expiresAt < new Date()) {
            throw new Error('OTP expired');
        }

        await Otp.deleteOne({ _id: otpData._id });
        const sessionToken = crypto.randomBytes(32).toString('hex');
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

        sessionStore.set(sessionToken, { email, expiresAt });
        await PasswordResetSession.create({
            token: sessionToken,
            email: email,
            expiresAt // 10 minutes
        });
        return {
            success: true,
            sessionToken
        };
    },
    verifyOtpEmail: async (args) => {
        const { otp, email, oldEmail } = args;
        const otpData = await Otp.findOne({ email: email, code: otp });
        if (!otpData) {
            throw new Error('Invalid OTP');
        }
        if (otpData.expiresAt < new Date()) {
            throw new Error('OTP expired');
        }
        const customerData = await Customer.findOneAndUpdate(
            { email: oldEmail },
            { $set: { email: email } },
            { new: true, runValidators: true }
        );
        await Otp.deleteOne({ _id: otpData._id });
        return true;
    },
    verifyOtpNewAccount: async (args) => {
        const { otp, email } = args;
        const otpData = await Otp.findOne({ email: email, code: otp });
        if (!otpData) {
            throw new Error('Invalid OTP');
        }
        if (otpData.expiresAt < new Date()) {
            throw new Error('OTP expired');
        }
        await Otp.deleteOne({ _id: otpData._id });
        return true;
    },
    updateCustomerPassword: async (args) => {
        const session = await PasswordResetSession.findOne({ token: args.updatePasswordInput.sessionToken });
        if (!session || session.expiresAt < Date.now()) {
            throw new Error("Invalid or expired token");
        }
        const password = await bcrypt.hash(args.updatePasswordInput.password, 12);
        const customerData = await Customer.findOneAndUpdate(
            { email: session.email },
            { password: password }
        );
        await PasswordResetSession.deleteOne({ token: args.updatePasswordInput.sessionToken });

        return true;
    },
    eventsByLocation: async (args) => {
        const city = args.city.toLowerCase();
        const state = args.state.toLowerCase();
        const events = await Event.find({ city, state });
        console.log(city, state, events, "events by location");
        if (!events || events.length === 0) {
            throw new Error("No events found for the specified location");
        }
        return events
    },

    createUser: async (args) => {
        const bool = await User.find({ email: args.userInput.email });
        if (false) {
            throw new Error("Email already exists");
        }
        return bcrypt.hash(args.userInput.password, 12)
            .then(hashedPassword => {
                const user = new User({
                    email: args.userInput.email,
                    password: hashedPassword
                })
                return user.save()
            })
            .then(result => {
                return { ...result._doc, createEvent: events.bind(result._doc.createEvent) }
            })
            .catch(err => {
                throw err;
            })

    },
<<<<<<< HEAD
    addBooking: async (args, context) => {
        const { req } = context;
        if (!req.auth) {
            throw new Error("You are not authenticated");
        }
=======
    addBooking: async (args, req) => {
        // if(req.auth){
>>>>>>> 582eafcfd1d70d483a7b9d52e8fb5034bd4ae280
        const fetchEvent = await Event.findOne({ _id: args.createBooking.eventId });
        // const fetchCustomer = await Customer.findOne({_id:args.createBooking.customerId});
        const fetchCustomer = req.customerId;
        const alreadyBooked = await Booking.findOne({ event: fetchEvent, customer: fetchCustomer })
        if (alreadyBooked) {
            return;
        }
        const booking = new Booking({
            event: fetchEvent,
            customer: fetchCustomer
        });
        const result = await booking.save();

        // const customers = await Customer.findById({_id:new mongoose.Types.ObjectId(`${fetchCustomer._id}`)});
        const customers = await Customer.findById({ _id: fetchCustomer });
        customers.createEvent.push(fetchEvent);
        const res = await customers.save();

        fetchEvent.bookedBy.push(customers);
        const eventResult = await fetchEvent.save();
        // console.log(fetchEvent.title, fetchEvent.date, fetchEvent.price, "DETAILS OF EVENT")
        // console.log(customers.firstname, customers.lastname, "DETAILS OF CUSTOMER");
        // console.log(req.email)
        const city = fetchEvent.city.charAt(0).toUpperCase() + fetchEvent.city.slice(1).toLowerCase();
        const state = fetchEvent.state.charAt(0).toUpperCase() + fetchEvent.state.slice(1).toLowerCase();
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: req.email,
            subject: `Booking Confirmation: ${fetchEvent.title}`,
            html: `<div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 8px;">
                        <h2 style="color: #0d6efd;">🎉 Booking Confirmed!</h2>
                        <p>Hi <strong>${customers.firstname + ' ' + customers.lastname}</strong>,</p>
                        <p>Thank you for booking your event with us. Here are your booking details:</p>
                        <ul style="list-style-type: none; padding-left: 0;">
                            <li><strong>Event:</strong> ${fetchEvent.title}</li>
                            <li><strong>Price:</strong> ₹${fetchEvent.price}</li>
                            <li><strong>Date:</strong> ${fetchEvent.date}</li>
                            <li><strong>Place:</strong> ${city+','+state}</li>
                            <li><strong>Address:</strong> ${fetchEvent.address}</li>
                        </ul>
                        <p>We look forward to seeing you at the event!</p>
                        <p style="margin-top: 20px;">Best regards,<br>Yourbookingsatyourspace</p>
                        </div>
  `,
        };
        await transporter.sendMail(mailOptions);

        return {
            ...result._doc, _id: result.id,
            event: singleEvent.bind(this, result._doc.event),
            bookedBy: bookedBy.bind(this, eventResult._doc.bookedBy),
            // user:user.bind(this,result._doc.user),
            customer: customer.bind(this, customers._id),
            createdAt: new Date(result._doc.createdAt).toISOString(),
            updatedAt: new Date(result._doc.updatedAt).toISOString()
        }

        // }
    },
<<<<<<< HEAD
    cancelBooking: async (args, context) => {
        const { req } = context;
=======
    cancelBooking: async (args, req) => {
>>>>>>> 582eafcfd1d70d483a7b9d52e8fb5034bd4ae280
        if (req.auth) {
            const deletedBooking = await Booking.findOne({ _id: args.bookingId });
            console.log("bella chao", deletedBooking)
            if (!deletedBooking) {
                throw new Error("Booking not found");
            }
            await Booking.deleteOne({ _id: args.bookingId });
            console.log(deletedBooking.event, "pooo")
            // const deletedEvent = await Booking.findById({_id:args.bookingId});
            // const event ={
            //     ...deletedEvent.event._doc,
            //     _id:deletedEvent.event.id,
            //     event:singleEvent.bind(this,deletedEvent._doc.event)
            // }
            // const cancelCreateEvent = await Customer.findById({ _id: req.customerId });

            await Customer.findByIdAndUpdate(
                req.customerId,
                { $pull: { createEvent: deletedBooking.event.toString() } }
            );
            // return {...deletedEvent.doc._id};
        }
    },

<<<<<<< HEAD
    login: async ({ email, password },context) => {
        const { req,res } = context;
=======
    login: async ({ email, password }) => {
>>>>>>> 582eafcfd1d70d483a7b9d52e8fb5034bd4ae280
        const customer = await Customer.findOne({ email: email });
        if (!customer) {
            throw Error('Email is incorrect');
        }
        const isEqual = await bcrypt.compare(password, customer.password)
        if (!isEqual) throw Error('Password is incorrect');
<<<<<<< HEAD
        
        const token = jwt.sign({ customerId: customer.id, email: customer.email }, 'Iamgood', {
            expiresIn: '1h'
        });
        res.cookie('token', token, {
            httpOnly: true,
            secure: false, // Set to true in production (HTTPS only)
            sameSite: 'Lax',
            maxAge: 60 * 60 * 1000 // 1 hour
        });                                      
        console.log(customer.email,customer.id,"heheh")
        return { CustomerId: customer.id, Email: customer.email,message:"Login Successful" }

    },
    checkLoggedIn: async (args, context) => {
        const { req } = context;
        const { email,CustomerId } = args;
        if (!req.auth) {
            throw new Error("You are not authenticated");
        }
        return{
            CustomerId: req.customerId,
            Email: req.email,
        }
    },        
    logOut:async(args,context)=>{
        const { req, res } = context;
        res.clearCookie('token');
        return {message:"Logout Successful"}
    },
=======

        const token = jwt.sign({ customerId: customer.id, email: customer.email }, 'Iamgood', {
            expiresIn: '1h'
        });
        // const decoded = jwt.decode(token);
        // if (!decoded) {
        //     throw Error('Failed to decode JWT');
        // }                                       
        return { CustomerId: customer.id, token: token, tokenExpiration: 1, Email: customer.email }

    },
>>>>>>> 582eafcfd1d70d483a7b9d52e8fb5034bd4ae280
    adminLogin: async ({ email, password }) => {
        const user = await User.findOne({ email: email });
        if (!user)
            throw Error("Invalidd Admin");
        const isEqual = await bcrypt.compare(password, user.password);
        if (!isEqual) throw Error("Invalid admin password");
        const token = jwt.sign({ UserId: user.id, email: user.email }, "GootAdmin", {
            expiresIn: '1h'
        })
        return { UserId: user.id, token: token, tokenExpiration: 1 }
    }
};