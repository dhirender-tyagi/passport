var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var app = express();
var cookieParser = require('cookie-parser');
var session = require('express-session');
var RedisStore = require('connect-redis')(session);
app.set('views', __dirname + '/views');

app.use(cookieParser());
app.use(session({
    store: new RedisStore({
        host: '127.0.0.1',
        port: 6379
    }),
    secret: 'Its a secret.',
    cookie: { secure: true }
})); 
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
//app.use(app.session({ secret: 'keyboard cat', key: 'sid'}))

var sess;

app.get('/',function(req,res){
//var cookies = new Cookies(req,res,keys);
    temp = req.cookies;
    console.log("cookie work is " + JSON.stringify(temp));
	sess=req.session;
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
		res.send('no session found');
	}
});

app.get('/login',function(req,res){
	
	res.cookie('email', 'abc@xyz.com', { expires: new Date(new Date().getTime() + (1000 * 60 * 60 * 24)), httpOnly: true });
	
sess=req.session;
 req.session.save(function(err){
   console.log('saved');
 })
	//In this we are assigning email to sess.email variable.
	//email comes from HTML page.
	sess.email='abc@xyz.com';
	sess.save(function(err){
       console.log('saved');
    })
	
	console.log('session is successfully created');
	res.end('done');
});

app.get('/admin',function(req,res){
	sess=req.session;
	if(sess.email)
	{
		res.write('<h1>Hello '+sess.email+'</h1>');
		res.end('<a href="+">Logout</a>');
	}
	else
	{
		res.write('<h1>Please login first.</h1>');
		res.end('<a href="+">Login</a>');
	}

});

app.get('/logout',function(req,res){

	req.session.destroy(function(err){
		if(err){
			console.log(err);
		}
		else
		{
			res.redirect('/');
		}
	});

});
app.listen(3000,function(){
	console.log("App Started on PORT 3000");
});
