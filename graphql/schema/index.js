const { buildSchema } = require('graphql');
module.exports = buildSchema(`
        type customer{
            _id:ID!
            name:String!
            email:String!
            password:String
            createEvent:[event!]
        }
        type event{
            _id:ID!
            title:String!
            price:Int!
            desc:String!
            date:String!
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
            _id:ID
            event:ID
            title:String   
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
            CustomerId:ID
            token:String!
            tokenExpiration:Int!
        }
        type adminAuth{
            UserId:ID
            token:String!
            tokenExpiration:Int!
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
        }
        input inputBooking{
            eventId:ID!
        }
        input inputCustomer{
            name:String!
            email:String!
            password:String!
        }
        type RootQuery{
           customerr:[customer!]!
           event:[event!]!
           booking:[booking!]!
           customer:[customer!]!
           login(email:String,password:String):auth
           adminLogin(email:String,password:String):adminAuth
           singleBooking:[singleBooking]!
           customerBookedAnEvent:customerBookedAnEvent!
        }
        type RootMutation{
            createEvent(eventInput:inputEvent):event
            createUser(userInput:inputUser):user
            createCustomer(customerInput:inputCustomer):customer
            addBooking(eventId:ID!):booking
            cancelBooking(bookingId:ID!):booking
            paymentGateway(eventId:ID!):paymentOrder
        }

        schema {
            query:RootQuery
            mutation:RootMutation
        }
    `);