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
  describe('GET /notes', function () {
    it('should return 200', function (done) {
      request()
        .get('/notes')
        .expect('Content-Type', /json/)
        .expect(200, done);
    });
  });
  describe('GET /notes/0', function () {
    it('should return 200', function (done) {
      request()
        .get('/notes/0')
        .expect(200, done);
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