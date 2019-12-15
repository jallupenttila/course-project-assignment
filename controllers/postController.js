var Post = require('../models/post');
var User = require('../models/users');


const { body,validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');


//Render home page when GET /home if there is userId in the session. Also find all post made by user logging in.
//Find is used to find all the post made by the user
exports.home = function(req, res, next) {


  Post.find({author: req.session.username}).sort({_id: -1}).exec(function (err, list_posts) {
    if (err) { return next(err); }


    if (req.session.userId) {
      res.render('home', { title: `${req.session.username}'s page`, post_list: list_posts});

    } else {
      res.redirect('/login')
    }
 });
};

//Render page with list of other users. Reverses the list order.
//Find if used to find all the users
exports.otherUsers = function(req, res, next) {

    User.find({}).sort({_id: -1}).exec(function (err, all_users) {

      if (err) { return next(err); }

      if (req.session.userId) {
        res.render('users', { title: 'Other users', user_list: all_users});

      } else {
        res.redirect('/login')
      }
    });

};

// Allows user to make a post. Maximum length for the message is 254. Message contains the message itself, time stamp and author.
exports.create = function(req, res, next) {
  sanitizeBody('*').trim().escape();

  var d = new Date();
  var a = d.getDate();
  var b = d.getMonth();
  var c = d.getFullYear();

  var sec = d.getSeconds();
  var min = d.getMinutes();
  var hour = d.getHours();


  var stamp =hour + ":" + min +":" + sec + " " + a + "/" + (b+1) + "/" + c

  if(req.body.content.length < 254){

    var post = new Post(
      { content: req.body.content,
        author: req.session.username,
        time: stamp
      });

      post.save(function (err) {
        if (err) { return next(err); }
        res.redirect('/home');
    });
  } else {

    res.redirect('/home');
  }
};

// Render page with other users posts.
exports.other = function(req, res, next) {

  Post.find({author: req.body.name}).exec(function (err, list_posts) {
    if (err) { return next(err); }

    if (req.session.userId) {
      res.render('other', { title: `${req.body.name}'s page`, post_list: list_posts});

    } else {
      res.redirect('/home')
    }
  });
};


//Render index page with GET /
exports.index = function(req, res, next) {

  res.render('index');
};
