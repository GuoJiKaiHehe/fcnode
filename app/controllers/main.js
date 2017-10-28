var express = require('express'),
  router = express.Router(),
  mongoose = require('mongoose');
  // Article = mongoose.model('Article');
var config=require("../myconfig");
module.exports = function (app) {

  app.use('/', require("../web_routes")(app,config));
};

router.get('/', function (req, res, next) {
 /* Article.find(function (err, articles) {
    if (err) return next(err);
    res.render('index', {
      title: 'Generator-Express MVC',
      articles: articles
    });
  });*/

  
});
