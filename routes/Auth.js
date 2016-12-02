//
// Module Imports
//
const jwt        = require('jsonwebtoken');
const expressJwt = require('express-jwt');
const routes     = require('express').Router();
const request    = require('request-promise');
const config     = require('../config');

//
// Models used in this route
//
const User = require('../models/User');

//
// Authentication Route
//
routes.post('/', (req, res) => {

  User.findOne({ email: req.body.email })
      .then(user => {

        // If no user is found or the password is incorrect
        if (!user || !user.comparePassword(req.body.password)) {

          // Send the "Bad Request"
          return res.status(400).json({
            error: "Username/Password incorrect"
          });
        }

        user.login_history.push(Date.now())

        // Save the user
        user.save( (err) => {

          // TODO: Handle this error
          if (err) throw err;

          let token = user.generateJwt();
          res.json({ token });
        });

      })
      .catch(error => {
        res.json({ error });
      });
});

//
// Handle Google OAuth 2.0
//
routes.post('/google', (req, res) => {

  let access_token = req.body.access_token;

  if (!access_token) {
    res.status(400).json({
      error: "Access Token is required"
    });
  }

  // Validate the token against Google
  let options = {
    uri: 'https://www.googleapis.com/oauth2/v3/tokeninfo',
    qs: {
      access_token: access_token
    },
    json: true
  };

  request(options)
        .then(validated => {
          options.uri = 'https://www.googleapis.com/userinfo/v2/me';
          return request(options);
        })
        .then(profile => {

          // Return the result of this promise
          return User.findOne({ email: profile.email})
                     .then(user => {

                       // If there's not a user, register the person
                       if (!user) {

                         // Create a new user model
                         var user = new User();

                         // Populate the fields
                         user.email       = profile.email;
                         user.first_name  = profile.given_name;
                         user.last_name   = profile.family_name;
                         user.signup_date = Date.now();
                         user.is_active   = true;
                         user.is_admin    = false;

                         // Consider the user as logged in
                         user.login_history.push(Date.now());
                       }
                       else {
                         // Update the login time
                         user.login_history.push(Date.now());
                       }

                       // Save the user
                       return user.save();
                     })
        })
        .then(user => {

          let token = user.generateJwt();
          res.json({ token });
        })
        .catch(error => {
          res.status(500).json({
            error
          });
        });
});

module.exports = routes;
