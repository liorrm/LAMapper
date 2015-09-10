// script to seed database with initial polygon data
var request = require('request');
var pg = require('pg');
var config = require('../config');

// first store the regions, because the neighborhood table has a constraint on the region table
var regionUrl = 'https://s3-us-west-2.amazonaws.com/mappingla.com/downloads/regions/la_county.json';

request.get(regionUrl, function(err, response, body) {

    // var neighborhoods = JSON.parse
    var regions = JSON.parse(body).features;

    regions.forEach(function(region) {
        var client = new pg.Client(config.dbUrl);
        var geomField = region.geometry.type === 'polygon' ? 'geom' : 'alt_geom';
        client.connect();
        var query = client.query('INSERT INTO region (name,' + geomField + ') VALUES ($1, ST_GeomFromGeoJSON($2)) ', [region.properties.Name, region.geometry]);
        query.on('error', function(err){
            console.log('there was an error: ', err);
        });
        query.on('end', function(){
            console.log('done')
            client.end();
        });
    });
});