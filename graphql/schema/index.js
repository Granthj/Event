const { buildSchema } = require('graphql');
module.exports = buildSchema(`
        type customer{
            _id:ID!
            firstname:String!
            lastname:String!
            dob:String!
            gender:String!
            email:String!
            password:String
            createEvent:[event!]
        }
        type cart{
            _id:ID!
            eventId:ID!
            customerId:ID!
            title:String!
            price:Int!
            desc:String!
            date:String!
<<<<<<< HEAD
            image:String!
            city:String!
            state:String!
            address:String!
=======
>>>>>>> 582eafcfd1d70d483a7b9d52e8fb5034bd4ae280
        }
        type event{
            _id:ID!
            title:String!
            price:Int!
            desc:String!
            date:String!
            city:String!
            state:String!
            address:String!
<<<<<<< HEAD
            image:String!
=======
>>>>>>> 582eafcfd1d70d483a7b9d52e8fb5034bd4ae280
            bookedBy:[customer!]
        }
        type customerBookedAnEvent{
            _id:ID
        }
        type user{
            _id:ID!
            email:String!
            password:String
            createEvent:[event!]
        }
        type singleBooking{
            title:String!
            price:String!
            desc:String!
            date:String!
        }
        type singleEvent{
            _id:ID!
        }
        type booking{
            _id:ID!
            customer:customer
            event:event!
            bookedBy:[customer!]
            createdAt:String!
            updatedAt:String
        }
        type paymentGateway{
            event:event!
        }
        type paymentOrder {
            id: ID!
            amount: Int!
            currency: String!
            status: String!
            # Add other fields as needed
          }
        type auth{
            CustomerId:ID!
            Email:String!
            message:String
        }
        type LogoutResponse{
            message:String!
        }
        type adminAuth{
            UserId:ID
            token:String!
            tokenExpiration:Int!
        }
        type booked{
            _id:ID!
            title:String!
            price:String!
            desc:String!
            date:String!
<<<<<<< HEAD
            image:String!
            city:String!
            state:String!
            address:String!
=======
>>>>>>> 582eafcfd1d70d483a7b9d52e8fb5034bd4ae280
            bookingId:ID!
            createdAt:String!
        }
        type session{
            success:Boolean!
            sessionToken:String!
        }
        input inputUser{
            email:String!
            password:String!
        }
        input inputEvent{
            title:String!
            price:Int!
            desc:String!
            date:String!
            city:String!
            state:String!
            address:String!
<<<<<<< HEAD
            image:String!
=======
>>>>>>> 582eafcfd1d70d483a7b9d52e8fb5034bd4ae280
        }
        input inputBooking{
            eventId:ID!
        }
        input inputCustomer{
            firstname:String!
            lastname:String!
            dob:String!
            gender:String!
            email:String!
            password:String!
        }
        input bookedEvent{
            eventId:ID!
            customerId:ID!
        }
        input inputCart{
            eventId:ID!
            customerId:ID!
        }
        input inputCartCancel{
            customerId:ID!
            cartId:ID!
        }
        input inputCutomerUpdate{
            customerId:ID!
            firstname:String!
            lastname:String!
            dob:String!
            gender:String!
            email:String!
            password:String!
            newPassword:String!
        }
        input inputUpdatePassword{
            password:String!
            sessionToken:String!
        }
        type RootQuery{
           customerData(customerId:ID):customer!
           event:[event!]!
           booking:[booking!]!
           customer:[customer!]!
           login(email:String,password:String):auth
           checkLoggedIn:auth
           adminLogin(email:String,password:String):adminAuth
           singleBooking:[singleBooking]!
           customerBookedAnEvent:customerBookedAnEvent!
           getCart(customerId:ID!):[cart!]!
           customerBooking(customerId:ID!):[booked!]!
           sendOtp(email:String!):String!
           sendOtpforNewEmail(email:String!):String
           sendOtpNewAccount(email:String!):String
           verifyOtp(otp:String!,email:String!):session!
           verifyOtpEmail(otp:String!,email:String,oldEmail:String!):Boolean
           verifyOtpNewAccount(otp:String!,email:String!):Boolean
           eventsByLocation(city:String!,state:String!):[event!]!
        }
        type RootMutation{
            logOut:LogoutResponse
            createEvent(eventInput:inputEvent):event
            createUser(userInput:inputUser):user
            createCustomer(customerInput:inputCustomer):customer
            addBooking(createBooking:bookedEvent):booking
            cancelBooking(bookingId:ID!):booking
            paymentGateway(eventId:ID!):paymentOrder
            cartEvent(cartInput:inputCart):cart
            cartEventDelete(cartCancelInput:inputCartCancel):cart
            updateCustomerData(updateCustomerInput:inputCutomerUpdate):customer
            updateCustomerPassword(updatePasswordInput:inputUpdatePassword):Boolean!
        }

        schema {
            query:RootQuery
            mutation:RootMutation
        }
    `);