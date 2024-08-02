const express = require('express')

const sites_route = express.Router();


//imports of methods from controller
const { addSites, getSitesList } = require('../controller/sites_controller')


//generating routes with methods GET,POST,PUT,PATCH,DELETE

//Add sites api.
sites_route.post('/addSites',addSites)

//get All sites
sites_route.get('/getAllSites',getSitesList)

//site wise sensors data.

module.exports = sites_route;