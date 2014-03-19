var express = require('express');

module.exports = function(app, config, passport) {
  app.configure(function () {
    app.use(express.compress());
    app.set('port', config.port);
    app.use(express.logger('dev'));
    app.use(express.cookieParser());
    app.use(express.cookieSession({
      secret: 'koira',
      cookie: {maxAge: 60 * 60 * 1000} // 1h
    }));
    app.use(express.json());
    app.use(express.urlencoded());
    app.use(express.methodOverride());
    app.use(passport.initialize());
    app.use(passport.session());
    app.use(app.router);
    app.use(function(req, res) {
      res.status(404).send('Sorry, 404 Not Found');
    });
    app.use(express.errorHandler({dumpExceptions: true, showStack: true}));
    // app.use(function (err, req, res, next) {
    //   console.log(err);
    //   res.send(500, { error: 'Something blew up!' });
    // });
  });
};