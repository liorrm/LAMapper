var express = require('express');
var app = express();
var proxy = require('express-http-proxy');
// var config = require('../config');

app.use(express.static(__dirname + '/public'));
app.set('view engine', 'ejs');

app.get('/', function(req, res) {
    res.render('index');
});


// proxy data requests to API server
app.use('/api', proxy('localhost:8081', {
    forwardPath: function(req, res) {
        return require('url').parse(req.url).path;
    }
}));

// catchall route to redirect home if route otherwise unhandled
app.get('/*', function(req, res) {
    res.redirect('/')
});

var server = app.listen(8080, function () {
    var host = server.address().address;
    var port = server.address().port;

    console.log('HTTP listening at http://%s:%s', host, port);
});