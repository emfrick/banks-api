//
// Module Imports
//
const config = require('../config');
const Bank   = require('../models/Bank');
const routes = require('express').Router();

//
// Get all banks
//
routes.get('/banks', (req, res) => {

  let limit = Number(req.query.limit) || config.limit.results;

  Bank.find()
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
// Get bank by ID
//
routes.get('/banks/:id', (req, res) => {
  Bank.find({ '_id': req.params.id })
      .then(bank => {
        res.json(bank);
      })
      .catch(error => {
        res.json({ error });
      });
});

//
// Export all routes
//
module.exports = routes;
