config = {};

config.dbUrl = process.env.DATABASE_URL || 'postgres://localhost:5432/la_mapper';

module.exports = config