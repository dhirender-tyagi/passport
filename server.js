var http = require('http');
var path = require('path');
var express= require('express');
var bodyParser = require('body-parser');
var passport = require('passport');
var app=express();
// var index = require('./index');
var FacebookStrategy = require('passport-facebook').Strategy;
var GoogleStrategy = require('passport-google').Strategy;

passport.serializeUser(function(user, done) {
done(null, user);
});

passport.deserializeUser(function(obj, done) {
done(null, obj);
});

// index(app,passport);
 passport.use(new FacebookStrategy({
        clientID: '311287302380554',
        clientSecret: '1533339c64d34a15ebb7a1c87a9b2452',
        callbackURL: "http://192.168.100.226:5555/auth/facebook/callback"
      },
      function(accessToken, refreshToken, profile, done) {
        console.log("success " + JSON.stringify(profile));
          return done(null, profile);
        
      }
      ));

passport.use(new GoogleStrategy({
        returnURL: 'http://localhost:5555/auth/google/callback',
        realm: 'http://localhost:5555/'
      },
      function(identifier, done) {
        console.log("success " + JSON.stringify(identifier));
          return done(null, identifier);
      }
      ));


app.use(passport.initialize());
app.use(passport.session());


app.get('/',function(req,res){
  console.log("hello");
  res.send("success");
})

app.get('/auth/facebook',passport.authenticate('facebook'),
function(req, res){
  res.status = 200;
  res.send("success");
});


app.get('/auth/google',passport.authenticate('google'),
function(req, res){
  res.status = 200;
  res.send("success");
});


app.get('/auth/facebook/callback',
 passport.authenticate('facebook', {
  successRedirect : '/',
  failureRedirect : '/failure'
}));

app.get('/auth/google/callback',
 passport.authenticate('google', {
  successRedirect : '/',
  failureRedirect : '/failure'
}));

app.listen(5555);