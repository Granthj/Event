const express = require('express');
const mongoose = require('mongoose');
const fs = require('fs');
const Event = require('./model/Event.js')
const User = require('./model/User.js');
const nodemailer = require('nodemailer');
const axios = require('axios');
const authorization = require('./utils/authorization.js')
const { graphqlHTTP } = require('express-graphql');
const Schema = require('./graphql/schema/index.js');
const Resolver = require('./graphql/resolver/index.js');
const cities = require('./graphql/data_utils/cities.json'); // Assuming you have a file with city data

const app = express();
app.use(authorization);

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Method', 'POST,GET,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    next();
})

app.use('/graphql', graphqlHTTP({
    schema: Schema,
    rootValue: Resolver,
    graphiql: true
}));
app.get('/api/search-cities', async (req, res) => {

    const { query } = req.query; 
   
    try {  
        const regex = new RegExp(`^${query}`, "i"); 
        const filtered = cities.filter((item) => regex.test(item.name));
        res.json(filtered.slice(0, 10)); 
    } catch (error) {
        console.error('Error fetching cities:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

mongoose.connect('mongodb+srv://root:8318383381@cluster0.i6ysx75.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0').then(res => {
    app.listen(7000);
    console.log('Connect');
})