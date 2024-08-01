

const express = require('express');
const { createUser, usersList, userLogin} = require('../controller/user_controller');
const router = express.Router();

router.post('/register', createUser);

router.get('/usersList',usersList);
router.post('/login',userLogin)

module.exports = router;
