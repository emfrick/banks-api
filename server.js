let express  = require('express');
let app      = express();
let mongoose = require('mongoose');
let jwt      = require('jsonwebtoken');
let Bank     = require('./models/Bank');
let db       = mongoose.connection;
let config   = require('./config');

mongoose.connect(`mongodb://${config.db.host}:${config.db.port}/${config.db.name}`);
mongoose.Promise = Promise;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log(`Connected to MongoDB @ mongodb://${config.db.host}:${config.db.port}/${config.db.name}`);
});

app.get('/banks', (req, res) => {
  Bank.find()
      .limit(config.limit.results)
      .sort('name')
      .then(banks => {
        res.json(banks);
      })
      .catch(error => {
        res.json({error});
      });
});
app.listen(config.server.port, config.server.host, () => {
  console.log(`Application Listening @ http://${config.server.host}:${config.server.port}`);
});
