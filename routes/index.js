//
// Module Imports
//
const jwt        = require('jsonwebtoken');
const expressJwt = require('express-jwt');
const config     = require('../config');
const Bank       = require('../models/Bank');
const routes     = require('express').Router();

//
// Get all banks
//
routes.get('/banks', (req, res) => {

  let limit = Number(req.query.limit) || config.limit.results;

  Bank.find({})
      .select({ 'name': true, '_id': true })
      .limit(limit)
      .sort('name')
      .then(banks => {
        res.json(banks);
      })
      .catch(error => {
        res.json({ error });
      });
});

//
// Get bank by ID - PROTECTED ROUTE
//
routes.get('/banks/:id', expressJwt({ secret: config.jwt.secret }), (req, res) => {
  Bank.find({ '_id': req.params.id })
      .then(bank => {
        res.json(bank);
      })
      .catch(error => {
        res.json({ error });
      });
});

//
// Authentication Route
//
routes.post('/auth', (req, res) => {

  // TODO: Authenticate the user
  // AuthenticateUser(req.body)

  // Authenticated, sign the token
  let token = jwt.sign({ name: req.body.name, age: 31 }, config.jwt.secret, {
    expiresIn: config.jwt.expiresIn
  });

  // Return the token and the success message
  res.json({
    token: token
  });
});

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
