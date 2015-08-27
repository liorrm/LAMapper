var express = require('express');
var app = express();
var pg = require('pg')

app.get('/', function(req, res) {
    console.log('request received')
    res.status(200).json({'ogewr': 'etwerwer'})
});


var server = app.listen(8080, function () {
    var host = server.address().address;
    var port = server.address().port;

    console.log('HTTP listening at http://%s:%s', host, port);
});

