const express = require('express');
const send_notification_route = express.Router();
const { sendNotification } = require('../../controller/admin_notification_controller/sent_notification_controller');


   
    send_notification_route.post('/sendNotification', sendNotification);
    module.exports = send_notification_route;