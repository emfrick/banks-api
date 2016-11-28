//
// Module imports
//
const bcrypt   = require('bcrypt');
const mongoose = require('mongoose');
const jwt      = require('jsonwebtoken');

//
// Configuration
//
const config = require('../config');

//
// Define the schema
//
const userSchema = mongoose.Schema({
  email: {
    type: String,
    index: true,
    unique: true
  },
  hash: String,
  salt: String,
  first_name: String,
  last_name: String,
  signup_date: Date,
  login_history: [Date],
  is_active: Boolean,
  is_admin: Boolean
});

//
// Custom method to set the password
// 'this' refers to the object instance (can't use ES6 arrow fns here)
userSchema.methods.setPassword = function(password) {

  // Hash the password
  this.salt = bcrypt.genSaltSync(config.security.salt.rounds);
  this.hash = bcrypt.hashSync(password, this.salt);
};

//
// Custom method to compare the password
// 'this' refers to the object instance (can't use ES6 arrow fns here)
//
userSchema.methods.comparePassword = function(password) {

  // Use bcrypt to compare
  return bcrypt.compareSync(password, this.hash);
};

//
// Generate a JWT directly on the model
//
userSchema.methods.generateJwt = function() {
  // 'this' refers to the object instance (can't use ES6 arrow fns here)

  // Return the signed token
  let payload = {
    email: this.email,
    _id: this._id
  }

  return jwt.sign( payload, config.jwt.secret, {
    expiresIn: config.jwt.expiresIn
  });

};

//
// Export a model
//
module.exports = mongoose.model('User', userSchema);
