// la_mapper database created in psql console
var pg = require('pg');
var dbUrl = process.env.DATABASE_URL || 'postgres://localhost:5432/la_mapper';

// establish db connection
var client = new pg.Client(dbUrl);
client.connect();

var createNeighborhoodQuery = 'CREATE TABLE neighborhood'
+ '('
+ 'id SERIAL PRIMARY KEY, '
+ 'region_id INTEGER, '
+ 'name VARCHAR(255), '
+ 'description TEXT, '
+ 'geom GEOMETRY(POLYGON), '
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