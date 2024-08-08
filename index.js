const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv =require('dotenv').config();
const dbConnect = require('./config/db')
const bodyParser = require('body-parser');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors')
const path = require('path');
const app = express();
const PORT = process.env.PORT || 5000;
const server = http.createServer(app);
const { initSocket } = require('./socket');
// const io = socketIo(server);
// app.io = io;
app.use(express.json());
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

//defining routes to use
app.use('/api/users',require('./routes/user_route'));
app.use('/api/sites',require('./routes/sites_routes'));
app.use('/api/notification',require('./routes/admin/send_notification_route'));


//socket connection 
initSocket(server);

dbConnect.query("SELECT 1").then(()=>{
    console.log("Database connected");
    server.listen(PORT,()=>{
        console.log(`Server listening on port ${PORT}`);
    })
   
});


