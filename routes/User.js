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
// Add user
//
routes.post('/', (req, res) => {

  // Check if email address already exists
  User.findOne({ email: req.body.email })
      .then(user => {

        // If a user was found, return an error
        if (user) {

          // User already exists
          return res.status(400).json({ error: "Email address is already registered" });
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
          user.save( (err) => {

            // TODO: Handle this error
            if (err) throw err;

            let token = user.generateJwt();
            res.json({
              token: token
            });

          });
        }

      })
      .catch(err => {
        return res.json({ error });
      });

});

module.exports = routes;
