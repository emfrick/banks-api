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

module.exports = routes;
