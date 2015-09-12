var pg = require('pg');
var config = require('../config')
var client = new pg.Client(config.dbUrl);
client.connect();

var query = client.query('CREATE EXTENSION postgis;');

console.log(query)

query.on('end', function() {
    console.log('success')
    client.end();
});

query.on('error', function(err) {
    console.log('there was an error', err)
    client.end();
});
