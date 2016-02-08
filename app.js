// dependencies
var fs = require('fs');
var express = require('express');
var path = require('path');
var config = require('./oauth.js');
var User = require('./models/user.js');
var mongoose = require('mongoose');
var passport = require('passport');
var fbAuth = require('./authentication.js');
var TwitterStrategy = require('passport-twitter').Strategy;
var GithubStrategy = require('passport-github2').Strategy;
var GoogleStrategy = require('passport-google-oauth2').Strategy;
var InstagramStrategy = require('passport-instagram').Strategy;
var routes = require('./routes/index')

var session = require('express-session')
var bodyParser = require('body-parser')
var cookieParser = require('cookie-parser')

// connect to the database
mongoose.connect('mongodb://localhost/passport-example');

var app = express();


app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
// app.use(express.logger());


// app.use(express.cookieParser());
app.use(cookieParser())


// app.use(express.bodyParser());
app.use(bodyParser.urlencoded({ extended: true }))
// parse application/json 
app.use(bodyParser.json())



// app.use(express.methodOverride());

// app.use(express.session({ secret: 'my_precious' }));
app.set('trust proxy', 1) // trust first proxy
app.use(session({
  secret: 'my_precious',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: true }
}))

app.use(passport.initialize());
app.use(passport.session());
// app.use(app.router);
app.use(express.static(__dirname + '/public'));


// serialize and deserialize
passport.serializeUser(function(user, done) {
  console.log('serializeUser: ' + user._id);
  done(null, user._id);
});
passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user){
    console.log(user);
      if(!err) done(null, user);
      else done(err, null);
    });
});

// routes
app.use('/', routes);

// port
app.listen(1337);

module.exports = app;