// la_mapper database created in psql console
var pg = require('pg');
var config = require('../config');

// establish db connection
var client = new pg.Client(config.dbUrl);
client.connect();

var createNeighborhoodQuery = 'CREATE TABLE region'
+ '('
+ 'id SERIAL PRIMARY KEY, '
+ 'name VARCHAR(255), '
+ 'description TEXT, '
+ 'geom GEOMETRY(POLYGON), '
+ 'population INTEGER, '
+ 'area FLOAT, '
+ 'demographics JSON'
+ ');'

console.log(createNeighborhoodQuery)

var query = client.query(createNeighborhoodQuery);

query.on('end', function(feedback) {
    console.log('Table created successfully: ', feedback)
    client.end();
});

query.on('error', function(err) {
    console.log('An error occurred: ', err)
    client.end();
});