var User = require('../models/users');
var bcrypt = require('bcrypt');


const saltRounds = 10;
const { body,validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');

//Render register page when GET /register
exports.register = function(req, res, next) {

    res.render('register');

};


//Render home page when GET /home
exports.home = function(req, res, next) {
    
    res.render('home');

};
//Render login page when GET /login
exports.login = function(req, res, next) {
    
    res.render('login');

};

//Create new user. User is stored to mongoDB database, password is hashed with bcrypt using 10 round salt.
//This function also tests if the username and email provided are found on the database. Username and email must be unique to every user.  
exports.create = function(req, res, next) {
  sanitizeBody('*').trim().escape();

  bcrypt.hash(req.body.password, saltRounds, function (err,   hash) {

    var user = new User({ 
        email: req.body.email,
        name: req.body.name,
        password: hash
    });


    if(user.email.length <= 20 && user.email.length >= 6 && user.name.length <= 15 &&  user.name.length >= 3 && req.body.password.length <= 25 && req.body.password.length >= 5 ){

    
      User.find({$or: [{email: user.email}, {name: user.name}]} ).exec(function (err, list_users) {

        
        if (err) { return next(err); }

        if (list_users === undefined || list_users.length == 0){

          user.save(function (err) {
          if (err) {
              res.redirect('/register')
          }
         
          res.redirect('/login');
    
          });

        } else {

          res.redirect('/register')

        
        }
      });
    } else {

      res.redirect('/register')
      console.log("This happens")
     
    }
  });
}

//Check if email and inserted password is on the database. If the login credentials are valid, user will be forwarded to his home page.
//When access is granted, users mongoDB id and username is written to session. 
exports.loginPost = function(req, res, next) {
  sanitizeBody('*').trim().escape();

 

  var logger = new User({ 
    email: req.body.email,
    password: req.body.password
  });

  if(logger.email.length && logger.password.length){


    User.find({email: logger.email}).exec(function (err, list_logger) {

      if (err) { return next(err); }
    
      if (list_logger.email !== undefined || list_logger != 0){

        if(logger.email === list_logger[0].email){

          bcrypt.compare(logger.password, list_logger[0].password, function (err, result) {
         
            
            if (result === true){
              req.session.userId = list_logger[0]._id  
              req.session.username = list_logger[0].name      
              res.redirect('/home');

            } else {

              res.redirect('/login')
            }
          });
        } else {

          res.redirect('/login')
          

        }
      }else{

        res.redirect('/login')

      }
    });
  } else {
   
    res.redirect('/login')



  }


};


//Logout, destroy session.
exports.logout = function(req, res, next) {
  
  req.session.destroy(err => {
    if (err){
      return res.redirect('/home')
  }

  res.redirect('/login')
  })

};

