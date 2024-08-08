const express = require('express');

const sensordata_routes = express.Router();

const {sendSensorData} = require('../controller/sensorsData_controller');

sensordata_routes.post('/sendSensorData',sendSensorData);


module.exports = sensordata_routes;