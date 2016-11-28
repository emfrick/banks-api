const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bankSchema = Schema({
  name: {
    type: String,
    required: true
  },
  address: String,
  city: String,
  state: String,
  zip: String,
  county: String,
  city_of_high_holder: String,
  num_branches: Number,
  website_address: String,
  create_date: Date,
  comments: [
    {
      author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
      },
      date: Date,
      body: String
    }
  ]
});

module.exports = mongoose.model('Bank', bankSchema);
