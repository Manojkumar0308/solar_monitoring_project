// const express = require('express');
// const {createUser} = require('../controller/user_controller');
// const router = express.Router();



// router.post('/register',createUser);

const express = require('express');
const { createUser } = require('../controller/user_controller');
const router = express.Router();

router.post('/register', createUser);



module.exports = router;
