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

module.exports = routes;
