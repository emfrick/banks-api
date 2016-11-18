//
// Module Imports
//
const jwt        = require('jsonwebtoken');
const expressJwt = require('express-jwt');
const routes     = require('express').Router();
const config     = require('../config');

//
// Models used in this route
//


//
// Authentication Route
//
routes.post('/', (req, res) => {

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

module.exports = routes;
