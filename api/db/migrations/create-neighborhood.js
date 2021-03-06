// la_mapper database created in psql console
var pg = require('pg');
var config = require('../config');

// establish db connection
var client = new pg.Client(config.dbUrl);
client.connect();

var createNeighborhoodQuery = 'CREATE TABLE neighborhood'
+ '('
+ 'id SERIAL PRIMARY KEY, '
+ 'region_id INTEGER, '
+ 'name VARCHAR(255) NOT NULL UNIQUE, '
+ 'description TEXT, '
+ 'geom GEOMETRY(MULTIPOLYGON), '
+ 'population INTEGER, '
+ 'type VARCHAR(255), '
+ 'area FLOAT, '
+ 'demographics JSON, '
+ 'FOREIGN KEY (region_id) REFERENCES region(id)'
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