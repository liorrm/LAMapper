var pg = require('pg');
var dbUrl = process.env.DATABASE_URL || 'postgres://localhost:5432/la_mapper';

var client = new pg.Client(dbUrl);
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
