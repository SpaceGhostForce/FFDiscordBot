'use strict';

const repos = require('./repos');

const initOptions = {
    extend(obj, dc) {
        obj.players = new repos.Players(obj, pgp);
        obj.drafts = new repos.Drafts(obj, pgp);
    }
};

const config = {
    host: 'localhost',
    port: 6543,
    database: 'ffdiscordbot',
    user: 'ffdiscordbot',
    password: ''
};

// Load and initialize pg-promise:
const pgp = require('pg-promise')(initOptions);

// Create the database instance:
const db = pgp(config);

// If you ever need access to the library's root (pgp object), you can do it via db.$config.pgp
// See: http://vitaly-t.github.io/pg-promise/Database.html#.$config
module.exports = db;