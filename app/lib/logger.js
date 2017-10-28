var myconfig=require("../myconfig");

var pathLib = require('path')


var env = process.env.NODE_ENV || "development"

var log4js = require('log4js');

log4js.configure({
  appenders: [
    { type: 'console' },
    { type: 'file', filename: pathLib.join(myconfig.log_dir, 'cheese.log'), category: 'cheese' }
  ]
});

var logger = log4js.getLogger('cheese');

logger.setLevel(myconfig.debug && env !== 'test' ? 'DEBUG' : 'ERROR')
console.log(logger.info,"info");

module.exports=logger;
