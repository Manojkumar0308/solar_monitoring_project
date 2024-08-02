const express = require('express')

const sites_route = express.Router();


//imports of methods from controller
const { addSites } = require('../controller/sites_controller')


//generating routes with methods GET,POST,PUT,PATCH,DELETE
sites_route.post('/addSites',addSites)

module.exports = sites_route;