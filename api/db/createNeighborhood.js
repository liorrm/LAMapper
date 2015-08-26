// la_mapper database created in psql console
var pg = require('pg');
var dbUrl = process.env.DATABASE_URL || 'postgres://localhost:5432/la_mapper';

// establish db connection
var client = new pg.Client(dbUrl);
client.connect();

var createNeighborhoodQuery = 'CREATE TABLE neighborhood'
+ '('
+ 'id user_id uuid DEFAULT uuid_generate_v4(),'
+ 'name varchar(255),'
+ 'population INTEGER(10),'
+ 'type varchar(255),'
+ 'area FLOAT,'
+ 'demographics json,'
+ ')'

var query = client.query('CREATE TABLE items(id SERIAL PRIMARY KEY, text VARCHAR(40) not null, complete BOOLEAN)');

query.on('end', function() {
  client.end();
});