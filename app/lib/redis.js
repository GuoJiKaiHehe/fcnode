var myconfig = require('../myconfig');
var Redis = require('ioredis');
var logger = require('./logger')

var client = new Redis(myconfig.db.redis);

client.on('error', function (err) {
  if (err) {
    logger.error('connect to redis error, check your redis config', err);
    process.exit(1);
  }
})

exports = module.exports = client;
