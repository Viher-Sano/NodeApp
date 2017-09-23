var path = require('path'),
    rootPath = path.normalize(__dirname + '/..'),
    env = process.env.NODE_ENV || 'development';

var config = {
  development: {
    root: rootPath,
    app: {
      name: 'nodetest'
    },
    port: process.env.PORT || 3000,
    db: 'mysql://root:12345@localhost/test'
  },

  test: {
    root: rootPath,
    app: {
      name: 'nodetest'
    },
    port: process.env.PORT || 3000,
    db: 'mysql://localhost/nodetest-test'
  },

  production: {
    root: rootPath,
    app: {
      name: 'nodetest'
    },
    port: process.env.PORT || 3000,
    db: 'mysql://localhost/nodetest-production'
  }
};

module.exports = config[env];
