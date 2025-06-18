const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const fs = require('fs');
const Event = require('./model/Event.js')
const User = require('./model/User.js');
const nodemailer = require('nodemailer');
const cloudinary = require('cloudinary').v2;
const axios = require('axios');
const multer = require('multer');
const authorization = require('./utils/authorization.js')
const { graphqlHTTP } = require('express-graphql');
const Schema = require('./graphql/schema/index.js');
const Resolver = require('./graphql/resolver/index.js');
const cities = require('./graphql/data_utils/cities.json'); // Assuming you have a file with city data
require('dotenv').config();
cloudinary.config({ 
    cloud_name: process.env.CLOUD_NAME, 
    api_key: process.env.CLOUD_API_KEY, 
    api_secret: process.env.CLOUD_API_SECRET // Click 'View API Keys' above to copy your API secret
});

const app = express();
app.use(cors({
    origin: 'http://localhost:1234', // ✅ your frontend origin
    credentials: true                // ✅ allow cookies
}));
app.use(cookieParser());
app.use(express.json()); 
app.use(authorization);

const storage = multer.memoryStorage();
const upload = multer({ storage })

// app.use((req, res, next) => {
    //     res.setHeader('Access-Control-Allow-Origin', '*');
    //     res.setHeader('Access-Control-Allow-Method', 'POST,GET,OPTIONS');
    //     res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');
    //     if (req.method === 'OPTIONS') {
    //         return res.sendStatus(200);
    //     }
    //     next();
    // })
app.post('/upload-img',upload.single('file'),function(req,res){
    // console.log(req.file,"IMAGE");
    if (!req.file) {
        return res.status(400).json({ error: 'No file provided' });
    }
     const stream = cloudinary.uploader.upload_stream(
    {
      folder: 'event_images', // optional folder
      public_id: `${Date.now()}-${req.file.originalname}`,
    },
    (error, result) => {
      if (error) {
        console.error('Cloudinary Upload Error:', error);
        return res.status(500).json({ error: 'Upload failed' });
      }
      return res.status(200).json({ imageUrl: result.secure_url });
    })
     stream.end(req.file.buffer);
})

app.use('/graphql', graphqlHTTP((req,res)=>({
    schema: Schema,
    rootValue: Resolver,
    graphiql: true,
    context:{ req, res }
})));
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