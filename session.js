var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var app = express();
var cookieParser = require('cookie-parser');
var session = require('express-session');
// var RedisStore = require('connect-redis')(session);
var mongoose = require('mongoose');
var MongoStore = require('connect-mongo')(session);
mongoose.connect('mongodb://localhost/session-example');

app.set('views', __dirname + '/views');

app.use(cookieParser());
app.use(session({
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
    secret: 'Its a secret.',
    cookie: { secure: false }
})); 
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
//app.use(app.session({ secret: 'keyboard cat', key: 'sid'}))

var sess;

app.get('/',function(req,res){

	// New session will get created
//var cookies = new Cookies(req,res,keys);
    temp = req.cookies;
    console.log("cookie work is " + temp["connect.sid"]);
	sess= req.session;

	console.log("session is " +JSON.stringify(sess));
	//Session set when user Request our app via URL
	if(sess && sess.email)
	{
		/*
		* This line check Session existence.
		* If it existed will do some action.
		*/
		console.log("session email at home " + sess.email);
		res.redirect('/admin');
	}
	else{
		res.write('<h1>no session found. Please login first.</h1>');
		res.end('<a href="/login">Login</a>');
	}
});

app.get('/login',function(req,res){
	
	//cookies to be set
	res.cookie('email', 'abc@xyz.com', { expires: new Date(new Date().getTime() + (1000 * 60 * 60 * 24)), httpOnly: true });
	
	//get the object of session saved in mongodb
	sess=req.session;
	sess_id = sess.id;
	req.session.save(function(err){
	   console.log('saved');
	})
	//In this we are assigning email to sess.email variable.
	//email comes from HTML page.
	sess.email='abc@xyz.com';
	//update session object in mongodb
	sess.save(function(err){
       console.log('saved');
    })
	
	console.log('session is successfully created');
	res.write('<h1>Goto admin.</h1>');
	res.end('<a href="/admin">Admin</a>');
	
});

app.get('/admin',function(req,res){
	sess=req.cookies;
	if(sess.email)
	{
		res.write('<h1>Hello '+sess.email+'</h1>');
		res.end('<a href="/logout">Logout</a>');
	}
	else
	{
		res.write('<h1>Please login first.</h1>');
		res.end('<a href="/login">Login</a>');
	}

});

app.get('/logout',function(req,res){
	console.log("session was  " + JSON.stringify(req.cookies))
	sess = req.session;
	//delete the session
	sess.destroy(function(err){
		res.cookies = {};
		res.redirect('/');
	})

});
app.listen(3000,function(){
	console.log("App Started on PORT 3000");
});
