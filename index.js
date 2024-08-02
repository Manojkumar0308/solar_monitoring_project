const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv =require('dotenv').config();
const dbConnect = require('./config/db')
const bodyParser = require('body-parser');
const app = express();
app.use(express.json());


//defining routes to use
app.use('/api/users',require('./routes/user_route'));
app.use('/api/sites',require('./routes/sites_routes'));
app.use(bodyParser.json());
const PORT = process.env.PORT || 5000;
dbConnect.query("SELECT 1").then(()=>{
    console.log("Database connected");
    app.listen(PORT,()=>{
        console.log(`Server listening on port ${PORT}`);
    })
});
