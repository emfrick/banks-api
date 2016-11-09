//
// Module Imports
//
const express  = require('express');
const app      = express();
const jwt      = require('jsonwebtoken');
const config   = require('./config');

//
// Setup the database
//
let Database = require('./database');
new Database(`${config.db.host}:${config.db.port}/${config.db.name}`);

//
// Initialize the routes
//
const routes = require('./routes');
app.use('/', routes);

//
// Start the application listening
//
app.listen(config.server.port, config.server.host, () => {
  console.log(`Application Listening @ http://${config.server.host}:${config.server.port}`);
});
