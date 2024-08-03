const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv =require('dotenv').config();
const dbConnect = require('./config/db')
const bodyParser = require('body-parser');
const http = require('http');
const socketIo = require('socket.io');
const app = express();
app.use(express.json());


//defining routes to use
app.use('/api/users',require('./routes/user_route'));
app.use('/api/sites',require('./routes/sites_routes'));
app.use('/api/notification',require('./routes/admin/send_notification_route'));
app.use(bodyParser.json());
const PORT = process.env.PORT || 5000;
const server = http.createServer(app);
const io = socketIo(server);
dbConnect.query("SELECT 1").then(()=>{
    console.log("Database connected");
    app.listen(PORT,()=>{
        console.log(`Server listening on port ${PORT}`);
    })
});

io.on('connection', (socket) => {
    console.log('New client connected');
    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});
