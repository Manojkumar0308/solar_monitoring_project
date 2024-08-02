

const express = require('express');
const { createUser, usersList, userLogin, userUpdate, updatePassword} = require('../controller/user_controller');
const router = express.Router();

router.post('/register', createUser);

router.get('/usersList',usersList);
router.post('/login',userLogin);
router.post('/userUpdate',userUpdate);
router.post('/updatePassword',updatePassword);



module.exports = router;
