/*global describe, it*/
'use strict';
var superagent = require('supertest');
var app = require('../app');

function request() {
	return superagent(app.listen());
}

describe('Routes', function () {
  describe('GET /', function () {
    it('should return 404', function (done) {
      request()
        .get('/')
        .expect(404, done);
    });
  });
  describe('GET /notes/notfound', function () {
    it('should return 404', function (done) {
      request()
        .get('/notes/notfound')
        .expect(404, done);
    });
  });
});