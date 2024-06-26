const express = require('express');
const mongoose = require('mongoose');
const Event = require('./model/Event.js')
const User = require('./model/User.js');
const authorization = require('./utils/authorization.js')
const { graphqlHTTP } = require('express-graphql');
const Schema = require('./graphql/schema/index.js');
const Resolver = require('./graphql/resolver/index.js');

const app = express();

app.use((req,res,next)=>{
    res.setHeader('Access-Control-Allow-Origin','*');
    res.setHeader('Access-Control-Allow-Method','POST,GET,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers','Content-Type,Authorization');
    if(req.method === 'OPTIONS'){
        return res.sendStatus(200);
    }
    next();
})
app.use(authorization);

app.use('/graphql',graphqlHTTP({
    schema:Schema,
    rootValue:Resolver,
    graphiql:true
}));

mongoose.connect('mongodb+srv://dasgranth24:8318383381@atlascluster.ka2yqg3.mongodb.net/?retryWrites=true&w=majority').then(res=>{
    app.listen(7000);
    console.log('Connect');
})