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
const Bank = require('../models/Bank');

//
// Get all banks
//
routes.get('/', (req, res) => {

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
routes.get('/:id', expressJwt({ secret: config.jwt.secret }), (req, res) => {
  Bank.find({ '_id': req.params.id })
      .then(bank => {
        res.json(bank);
      })
      .catch(error => {
        res.json({ error });
      });
});

//
// Create a new bank
//
routes.post('/', expressJwt({ secret: config.jwt.secret }), (req, res) => {

  // Check if the bank already exists by name
  Bank.findOne({ 'name': req.body.name })
      .then(bank => {

        // If a bank was found, return an error
        if (bank) {
          // Bank already exists
          throw new Error(`Bank '${bank.name}' already exists`);
        }
        else {
          // Create a new user model
          var bank = new Bank();

          // Populate the fields
          bank.name =  req.body.name;
          bank.address =  req.body.address;
          bank.city =  req.body.city;
          bank.state =  req.body.state;
          bank.zip =  req.body.zip;
          bank.county =  req.body.county;
          bank.city_of_high_holder =  req.body.city_of_high_holder;
          bank.num_branches =  req.body.num_branches;
          bank.website_address =  req.body.website_address;
          bank.create_date = Date.now();
          bank.comments =  [];

          // Save the user
          return bank.save();
        }

      })
      .then(bank => {
          res.json({
            bank: bank
          });
      })
      .catch(error => {

        // Mongoose Validation Error
        if (error.name === 'ValidationError') {

          let errorMessage = '';
          switch (error.errors.name.kind) {

            case 'required':
              errorMessage = `Property ${error.errors.name.path} is required`
              break;

            default:
              errorMessage = error.message
              break;
          }

          res.status(401).json({
            error: errorMessage
          });
        }
        else {
          res.status(400).json({
            error: error.message
          });
        }
      });
})

module.exports = routes;
