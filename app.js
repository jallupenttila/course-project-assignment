// Made by Janne Penttila. This is course project assignment for the course CT30A3203 Web Applications
// This course demo was used as a basis for this work: https://bitbucket.org/aknutas/www-demos/src/master/expressjs-sample/
// The idea and some details for the session control and authentication came from this video: https://www.youtube.com/watch?v=OH6Z0dJ_Huk&t=1692s
// I refer the video above as "reference video"

//All that is required
const express = require('express')
const bodyParser = require('body-parser')
const session = require('express-session')
var logger = require('morgan');
var Promise = require("bluebird");
var createError = require('http-errors');
var path = require('path');
var routes = require('./routes/routes');

// This is for the session control, borrowed from the youtube video (reference 1 in documentation)

const TWO_HOURS = 1000 * 60 * 60 * 2

const {
  PORT = 3000,
  NODE_ENV = 'development',
  SESS_LIFETIME = TWO_HOURS,
  SESS_NAME = 'sid',
  SESS_SECRET= 'jallupee'
} = process.env

const IN_PROD = NODE_ENV === 'production'

// Define app, use express
const app = express()

//MongoDB connection using Mongoose

var mongoose = require('mongoose');
var dev_db_url = 'mongodb://localhost:27017'
//var dev_db_url = 'mongodb://mongo:27017'
var mongoDB = process.env.MONGODB_URI || dev_db_url;
mongoose.connect(mongoDB);
mongoose.Promise = Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));


//Use view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({extended: true}));

//This is implemented as in reference video. This will make the app to use session and gives it all the options
app.use(session({
  name: SESS_NAME,
  resave: false,
  saveUninitialized: false,
  secret: SESS_SECRET,
  cookie: {
    maxAge: SESS_LIFETIME,
    sameSite: true,
    secure: IN_PROD, //
  }
}));

//Start routes from /
app.use('/', routes);


//Starts a socket and listens on a given path
app.listen(PORT, () => console.log(
  `http://localhost:${PORT}`
))

module.exports = app;
