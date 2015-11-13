var express = require('express');
var sassMiddleware = require('node-sass-middleware');
var app = express();
var port = 8080;
//////////////////////////////////////////////////////////
app.use(sassMiddleware({
    src: __dirname + '/public/',
    dest: __dirname + '/public/css',
    debug: true,
    prefix: '/css',
    outputStyle: 'expanded'
}));
//////////////////////////////////////////////////////////
app.set('port', process.env.PORT || port);
app.use(express.static(__dirname + "/public"));
app.use('/*', function(req, res) {
    res.sendFile(__dirname + '/public/index.html');
});
app.listen(port, function() {
    console.log('active on port '+ port);
});