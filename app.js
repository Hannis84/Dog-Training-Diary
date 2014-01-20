'use strict';
var messages = require('./controllers/notes');
var logger = require('koa-logger');
var serve = require('koa-static');
var route = require('koa-route');
var koa = require('koa');
var path = require('path');
var app = module.exports = koa();

// Logger
app.use(logger());

app.use(route.get('/notes', messages.all));
app.use(route.get('/notes/:id', messages.fetch));
app.use(route.post('/notes', messages.create));

// Serve static files
app.use(serve(path.join(__dirname, 'public')));

if (!module.parent) {
  app.listen(3000);
  console.log('listening on port 3000');
}