// script to seed database with initial polygon data
var request = require('request');
var pg = require('pg');
var config = require('../config');
var async = require('async');
var regionUrl = 'https://s3-us-west-2.amazonaws.com/mappingla.com/downloads/regions/la_county.json';
var neighborhoodUrl = 'https://s3-us-west-2.amazonaws.com/mappingla.com/downloads/neighborhoods/la_county.json';

// first store the regions, because the neighborhood table has a constraint on the region table
function saveRegion(region, client, cb) { // client should be connected here
    // don't close the connection after each INSERT. Close it after all are done;

   var sql = 'INSERT INTO region (name, geom) VALUES ($1, ST_GeomFromGeoJSON($2))'

   var query = client.query(sql, [region.properties.Name, region.geometry]);

   query.on('error', function(err){
       console.log('there was an error: ', sql, err);
   });

   query.on('end', function(){
       console.log('done saving region');
       cb();
   });
}

function saveNeighborhood(neighborhood, client, cb) {

    // use ST_WITHIN to find the region the neighborhood belongs to
    var sql = ''
+    'INSERT INTO neighborhood '
+        '( '
+            'name, '
+            'geom, '
+            'region_id '
+    ') '
+    'VALUES '
+    '( '
+            '$1, ( '
+                'CASE ST_IsValid(ST_GeomFromGeoJSON($2)) ' // check for validity
+                    'WHEN TRUE THEN ST_GeomFromGeoJSON($2) '
+                    'ELSE ST_CollectionExtract(ST_GeomFromGeoJSON($2), 3) '
                      // if not valid, extract valid collection
+                'END), '
+                '( '
+                    'SELECT id '
+                    'FROM region '
+                    'WHERE ST_Contains(geom, ST_Centroid(ST_GeomFromGeoJSON($2)) ) '
                      // find the region that contains the neighborhood's centroid
                      // and assign that region id as the neighborhood's region id
+                ') '
+        ')'

console.log(sql)

    var query = client.query(sql, [neighborhood.properties.name, neighborhood.geometry]);

    query.on('error', function(err){
        console.log('there was an error WITH THIS neighborhood: ', neighborhood.properties.name, err);
        cb();
    });

    query.on('end', function(){
        console.log('done saving neighborhood');
        cb();
    });

}

function seedTable(polygonUrl, saveFunction, callback) {

    console.log('url', polygonUrl, 'fn', saveFunction.name)

    request.get(polygonUrl, function(err, response, body) {

        // connect to db
        var polygons = JSON.parse(body).features;
        var client = new pg.Client(config.dbUrl);
        client.connect();
        async.each(polygons,
            function(polygon, cb) {
                saveFunction(polygon, client, cb)
            },
            function(err) {
                if (err) {console.log(err); client.end();}
                client.end();
                callback();
            }
        )

    });

}

function closeConnection(client) {
    client.end();
}

async.series([
    function(callback) {
        seedTable(regionUrl, saveRegion, callback)
    },
    function(callback) {
        seedTable(neighborhoodUrl, saveNeighborhood, callback)
    }
])
