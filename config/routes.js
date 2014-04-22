var express = require('express');
var user = require('../controllers/user');
var training = require('../controllers/training');

module.exports = function (app, auth) {

  app.get('/dogs', auth.authenticated, function (req, res) {
    res.send(200);
  });

  app.post('/login', auth.authenticate, function (req, res) {
    res.send(200);
  });

  app.post('/logout', auth.authenticated, function (req, res) {
    req.logout();
    res.send(200);
  });

  app.post('/signup', auth.exists, user.signup);

  app.get('/authenticated', auth.authenticated, function (req, res) {
    res.send(200);
  });

  app.get('/admin', auth.isAdmin, function (req, res) {
    res.send(200);
  });

  app.get('/trainings', auth.authenticated, training.get);
  app.post('/trainings', auth.authenticated, training.add);
};
