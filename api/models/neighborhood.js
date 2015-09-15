var pg = require('pg');
var config = require('../config');

exports.selectAll = function(callback) {

    var sql = 'SELECT name, ST_AsGeoJSON(geom) AS geojson FROM neighborhood';

    pg.connect(config.dbUrl, function(err, client, done) {
        if(err) {
            return console.error('error fetching client from pool', err);
        }
        client.query(sql, [], function(err, results) {
            //call `done()` to release the client back to the pool
            done();

            if(err) {
                console.error('error running query', err);
                return callback(err);
            }
            return callback(null, results)
        });
    });
}