var express = require('express');
var app = express();
var port = 8080;

//////////////////////////////////////////////////////////
app.set('port', process.env.PORT || port);
app.use(express.static(__dirname + "/public"));
app.use('/*', function(req, res) {
    res.sendFile(__dirname + '/public/index.html');
});
app.listen(port, function() {
    console.log('active on port '+ port);
});