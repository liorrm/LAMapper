// la_mapper database created in psql console
var pg = require('pg');
var dbUrl = process.env.DATABASE_URL || 'postgres://localhost:5432/la_mapper';

// establish db connection
var client = new pg.Client(dbUrl);
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

query.on('end', function() {
    console.log('created')
    client.end();
});

query.on('error', function(err) {
    console.log('error', err)
    client.end();
});