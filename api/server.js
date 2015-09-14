var express = require('express');
var app = express();
var pg = require('pg');
var regionModel = require('./models/region');
var neighborhoodModel = require('./models/neighborhood');

app.get('/regions', function(req, res) {
    console.log('request received');
    regionModel.selectAll(function(err, results) {
        if (err) {
            return res.status(500).json({'message': 'database error'})
        } else {
            return res.status(200).json(results);
        }
    })
});

app.get('/neighborhoods', function(req, res) {
    console.log('request received');
    neighborhoodModel.selectAll(function(err, results) {
        if (err) {
            return res.status(500).json({'message': 'database error'})
        } else {
            return res.status(200).json(results);
        }
    })
});


var server = app.listen(8081, function () {
    var host = server.address().address;
    var port = server.address().port;

    console.log('HTTP listening at http://%s:%s', host, port);
});

