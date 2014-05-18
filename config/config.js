var path = require('path'),
    rootPath = path.normalize(__dirname + '/..'),
    env = process.env.NODE_ENV || 'development',
    port = process.env.PORT || 3000;

var config = {
  development: {
    root: rootPath,
    app: {
      name: 'dog-api'
    },
    port: port,
    db: 'mongodb://localhost/dog'
  },

  test: {
    root: rootPath,
    app: {
      name: 'dog-api'
    },
    port: port,
    db: 'mongodb://localhost/dog'
  },

  production: {
    root: rootPath,
    app: {
      name: 'dog-api'
    },
    port: port,
    db: process.env.MONGOHQ_URL
  }
};

module.exports = config[env];
