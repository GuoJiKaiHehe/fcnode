var path = require('path'),
    rootPath = path.normalize(__dirname + '/..'),
    env = process.env.NODE_ENV || 'development';

var config = {
  development: {
    root: rootPath,
    app: {
      name: 'myclub'
    },
    port: process.env.PORT || 3000,
    db: 'mongodb://localhost/myclub'
  },

  test: {
    root: rootPath,
    app: {
      name: 'myclub'
    },
    port: process.env.PORT || 3000,
    db: 'mongodb://localhost/myclub-test'
  },

  production: {
    root: rootPath,
    app: {
      name: 'myclub'
    },
    port: process.env.PORT || 3000,
    db: 'mongodb://localhost/myclub-production'
  }
};

module.exports = config[env];
