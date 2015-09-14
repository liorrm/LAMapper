var express = require('express');
var app = express();
// app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(__dirname + '/public'));
app.set('view engine', 'ejs');

app.get('/', function(req, res) {
    console.log('request receivev')
    res.render('index');
});


var server = app.listen(8080, function () {
    var host = server.address().address;
    var port = server.address().port;

    console.log('HTTP listening at http://%s:%s', host, port);
});