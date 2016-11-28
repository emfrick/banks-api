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
const User = require('../models/User');

//
// Get all users
//
routes.get('/', (req, res) => {

  let limit = Number(req.query.limit) || config.limit.results;

  User.find({})
      .select({ _id: true, email: true })
      .limit(limit)
      .sort('last_name')
      .then(users => {
        res.json(users);
      })
      .catch(error => {
        res.json({ error });
      });
});

//
// Get an individual user
//
routes.get('/:id', expressJwt({ secret: config.jwt.secret }), (req, res) => {

  User.findOne({ '_id': req.params.id })
      .select({ 'hash': false, 'salt': false })
      .then(user => {
        res.json(user);
      })
      .catch(error => {
        res.json({ error });
      });
})

//
// Add user
//
routes.post('/', (req, res) => {

  // Check if email address already exists
  User.findOne({ email: req.body.email })
      .then(user => {

        // If a user was found, return an error
        if (user) {
          // User already exists
          throw new Error("Email address already exists");
        }
        else {
          // Create a new user model
          var user = new User();

          // Populate the fields
          user.email       = req.body.email;
          user.first_name  = req.body.first_name;
          user.last_name   = req.body.last_name;
          user.signup_date = Date.now();
          user.is_active   = true;
          user.is_admin    = false;

          // Consider the user as logged in
          user.login_history.push(Date.now());

          // Use the schema method to set the password
          user.setPassword(req.body.password);

          // Save the user
          return user.save();
        }

      })
      .then(user => {
          let token = user.generateJwt();
          res.json({
            token: token
          });
      })
      .catch(error => {
        res.json({ error: error.message });
      });

});

module.exports = routes;
