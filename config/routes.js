var express = require('express');
var user = require('../controllers/user');
var training = require('../controllers/training');
var dog = require('../controllers/dog');

module.exports = function (app, auth) {

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
  app.get('/trainings/:id', auth.authenticated, training.getById);
  app.post('/trainings', auth.authenticated, training.add);
  app.put('/trainings/:id', auth.authenticated, training.edit);
  app.delete('/trainings/:id', auth.authenticated, training.delete);

  app.get('/dogs', auth.authenticated, dog.get);
  app.get('/dogs/:id', auth.authenticated, dog.getById);
  app.post('/dogs', auth.authenticated, dog.add);
  app.put('/dogs/:id', auth.authenticated, dog.edit);
};
