//
// Module Imports
//
const express    = require('express');
const app        = express();
const bodyParser = require('body-parser');
const morgan     = require('morgan');
const cors       = require('cors');
const config     = require('./config');

//
// Setup the database
//
let Database = require('./database');
new Database(`${config.db.host}:${config.db.port}/${config.db.name}`);

//
// Allow Cross-Origin-Resource Sharing
//
app.use(cors());

//
// Setup Body-Parser to grab JSON Post Requests and/or URL parameters
//
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//
// Morgan logs all requests
//
app.use(morgan('dev'));

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
