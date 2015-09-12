// script to seed database with initial polygon data
var request = require('request');
var pg = require('pg');
var config = require('../config');
var async = require('async');
var regionUrl = 'https://s3-us-west-2.amazonaws.com/mappingla.com/downloads/regions/la_county.json';
var neighborhoodUrl = 'https://s3-us-west-2.amazonaws.com/mappingla.com/downloads/neighborhoods/la_city.json';

// first store the regions, because the neighborhood table has a constraint on the region table
function saveRegion(region, client, cb) { // client should be connected here
    // don't close the connection after each INSERT. Close it after all are done;

   var geomField = region.geometry.type === 'polygon' ? 'geom' : 'alt_geom';

   var sql = 'INSERT INTO region (name, ' + geomField + ') VALUES ($1, ST_GeomFromGeoJSON($2))'

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

    var geomField = neighborhood.geometry.type === 'polygon' ? 'geom' : 'alt_geom';

    console.log('this should be name', neighborhood.properties.name )

    // use ST_WITHIN to find the region the neighborhood belongs to
    var sql = 'INSERT INTO neighborhood (name, ' + geomField + ', region_id) VALUES ($1, ST_GeomFromGeoJSON($2), (SELECT id FROM region WHERE ST_Intersects( (CASE WHEN geom IS NULL THEN alt_geom ELSE geom END),ST_GeomFromGeoJSON($2) ) LIMIT 1 ))'

    var query = client.query(sql, [neighborhood.properties.name, neighborhood.geometry]);

    console.log('this is query', query)

    query.on('error', function(err){
        console.log('there was an error: ', err);
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
                if (err) {console.log(err)}
                client.end();
                callback();
            }
        )
        // async.each(polygons, saveFunction(item, client, callback), cb)

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


// async.series([
//   function(callback) {
//     fetchUsers(callback);
//   },
//   function(callback) {
//     renderUsersOnPage(callback);
//   },
//   function(callback) {
//     fadeInusers(callback);
//   }
//   function(callback) {
//     loadUserPhotos(callback);
//   }
// ]);




// function seedDb(regionUrl, neighborhoodUrl, callback) {

// };



// request.get(regionUrl, function(err, response, body) {

//     // var neighborhoods = JSON.parse
//     var regions = JSON.parse(body).features;

//     regions.forEach(function(region, index) {
//         var client = new pg.Client(config.dbUrl);
//         var geomField = region.geometry.type === 'polygon' ? 'geom' : 'alt_geom';
//         client.connect();

//         var query = client.query('INSERT INTO region (name,' + geomField + ') VALUES ($1, ST_GeomFromGeoJSON($2)) ', [region.properties.Name, region.geometry]);

//         query.on('error', function(err){
//             console.log('there was an error: ', err);
//         });

//         query.on('end', function(){
//             console.log('done')
//             client.end();
//         });
// });