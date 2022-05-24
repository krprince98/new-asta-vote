const express = require('express');

const UserController = require('../controllers/users')

const router = express.Router();

router.post('/signup', UserController.createUser);

router.post('/signin', UserController.userSignin);

module.exports = router;
