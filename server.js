var express = require('express');
var sassMiddleware = require('node-sass-middleware');
var app = express();
var mongoose = require('mongoose');
var morgan       = require('morgan'); // required?
var bodyParser   = require('body-parser');
//var session      = require('express-session');
var port = 8080;

var config = require('./config/db.js');

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With,x-access-token');
if ('OPTIONS' == req.method) {
      res.send(200);
    }
    else {
      next();
    }
});
//////////////////////////////////////////////////////////
mongoose.connect(config.url); // connect to our database
app.set('superSecret', config.secret); // secret variable

app.use(bodyParser.json()); // get information from html forms
app.use(bodyParser.urlencoded({ extended: true }));

//app.use(session({ secret: 'thisisasessionsecret' })); // session secret
//////////////////////////////////////////////////////////
app.use(sassMiddleware({
    src: __dirname + '/public/',
    dest: __dirname + '/public/css',
    debug: true,
    prefix: '/css',
    outputStyle: 'expanded'
}));
//////////////////////////////////////////////////////////
//routes
require('./routes/api.js')(app,express);

//////////////////////////////////////////////////////////
app.set('port', process.env.PORT || port);
app.use(express.static(__dirname + "/public"));
app.use('/*', function(req, res) {
    res.sendFile(__dirname + '/public/index.html');
});
app.listen(port, function() {
    console.log('active on port '+ port);
});