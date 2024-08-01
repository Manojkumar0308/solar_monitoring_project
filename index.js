const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv =require('dotenv').config();
const dbConnect = require('./config/db')

const app = express();
app.use(express.json());
app.use('/api/users',require('./routes/user_route'))

const PORT = process.env.PORT || 5000;
dbConnect.query("SELECT 1").then(()=>{
    console.log("Database connected");
    app.listen(PORT,()=>{
        console.log(`Server listening on port ${PORT}`);
    })
});
