const mongoose = require('mongoose');

const bankSchema = mongoose.Schema({
  name: String,
  address: String,
  city: String,
  state: String,
  zip: String,
  county: String,
  city_of_high_holder: String,
  num_branches: Number,
  website_address: String
});

module.exports = mongoose.model('Bank', bankSchema);
