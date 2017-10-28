var urllib  = require('url');
var request = require('request');
var logger = require('../lib/logger')
var _ = require('lodash')


exports.proxy = function (req, res, next) {
  var url = decodeURIComponent(req.query.url);
  var hostname = urllib.parse(url).hostname;
    request.get({
      url: url,
      headers: _.omit(req.headers, ['cookie', 'refer']),
    })
    .on('response', function (response) {
      res.set(response.headers);
    })
    .on('error', function (err) {
      logger.error(err);
    })
    .pipe(res);  
}