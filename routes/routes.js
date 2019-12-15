var express = require('express');
var router = express.Router();

// Require controllers
var user_controller = require('../controllers/userController');
var post_controller = require('../controllers/postController');

// GET post listing page
router.get('/home', post_controller.home);

router.get('/login', user_controller.login);

router.get('/register', user_controller.register);

router.get('/otherUser', post_controller.other);

router.get('/logout', user_controller.logout);

router.get('/', post_controller.index);

router.get('/otherUserList', post_controller.otherUsers);

// POST

router.post('/createUser', user_controller.create);

router.post('/login', user_controller.loginPost);

router.post('/createPost', post_controller.create);

router.post('/otherUser', post_controller.other);


module.exports = router;

