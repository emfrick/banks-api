//
// Module Imports
//
const jwt        = require('jsonwebtoken');
const expressJwt = require('express-jwt');
const config     = require('../config');
const routes     = require('express').Router();

//
// Import route modules
//
const BankRoutes = require('./Bank');
const AuthRoutes = require('./Auth');
const UserRoutes = require('./User');

//
// Define all routes
//
routes.use('/banks', BankRoutes);
routes.use('/auth',  AuthRoutes);
routes.use('/users', UserRoutes);

//
// Catch the express-jwt errors
//
routes.use((err, req, res, next) => {

  // Express-Jwt error name
  if (err.name === 'UnauthorizedError') {
    res.status(401).json({
      error: err.message
    });
  }

});

//
// Export all routes
//
module.exports = routes;
