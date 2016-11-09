let mongoose = require('mongoose');

class Database {

  constructor(url) {
    mongoose.connect(`mongodb://${url}`);
    mongoose.Promise = Promise;

    let db = mongoose.connection;

    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', () => {
      console.log(`Connected to MongoDB @ mongodb://${url}`);
    });
  }

}

module.exports = Database;
