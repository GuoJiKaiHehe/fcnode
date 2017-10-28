require("colors");
var express = require('express');
var glob = require('glob');

var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var compress = require('compression');
var methodOverride = require('method-override');
var session=require("express-session");
var csurf = require('csurf');
var RedisStore = require('connect-redis')(session);

var errorhandler = require('errorhandler')
var _=require("lodash");

var requestLog = require("../app/middlewares/request_log");
var renderMiddleware=require("../app/middlewares/render");
var proxyMiddleware=require("../app/middlewares/proxy");
var myconfig=require("../app/myconfig");
var auth = require("../app/middlewares/auth");
module.exports = function(app, config) {
  var env = process.env.NODE_ENV || 'development';
  app.locals.ENV = env;
  app.locals.ENV_DEVELOPMENT = env == 'development';
  
  app.set('views', config.root + '/app/views');
  app.set('view engine', 'html');
  app.engine("html",require("ejs-mate"));
  app.locals._layoutFile='layout.html';
  app.enable("trust proxy");
  

  
  app.use(requestLog);
  // app.use(favicon(config.root + '/public/img/favicon.ico'));
  if(config.debug){
    app.use(renderMiddleware.render);
    app.use(logger('dev'));
  }
  app.use(require('response-time')());

  app.use(bodyParser.json({limit:"1mb"}));
  app.use(bodyParser.urlencoded({
    extended: true,
    limit:"1mb"
  }));
  app.use(cookieParser(myconfig.session_secret ));
  app.use(compress());
  app.use(methodOverride());
  
  app.use(session({
  secret: myconfig.session_secret,
  store: new RedisStore(myconfig.db.redis),
  resave: false,
  saveUninitialized: false,
}));

  app.use(function(req,res,next){
    console.log('111');
    next()
  })
  app.use(express.static(config.root + '/public'));
  app.use('/agent', proxyMiddleware.proxy);//代理
  
  _.extend(app.locals,{
    myconfig:myconfig
  });
  _.extend(app.locals, require('../app/lib/render_helper'));
 app.use(auth.authUser);
 
  app.use(function (req, res, next) {
    if (req.path === '/api' || req.path.indexOf('/api') === -1) {
    console.log(req.path);
      csurf()(req, res, next);
      return;
    }
    next();
  });
  app.set('view cache', false);
  app.use(function (req, res, next) {
    console.log("11111");
    res.locals.csrf = req.csrfToken ? req.csrfToken() : '';
    next();
  });

 /* var controllers = glob.sync(config.root + '/app/controllers/*.js');
  controllers.forEach(function (controller) {
    require(controller)(app);
  });*/
   require(config.root + '/app/controllers/main')(app);
  app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
  });
  
  if(app.get('env') === 'development'){
    app.use(function (err, req, res, next) {
      res.status(err.status || 500);
      res.render('error', {
        message: err.message,
        error: err,
        title: 'error'
      });
    });
  }

  app.use(function (err, req, res, next) {
    res.status(err.status || 500);
      res.render('error', {
        message: err.message,
        error: {},
        title: 'error'
      });
  });

  return app;
};



