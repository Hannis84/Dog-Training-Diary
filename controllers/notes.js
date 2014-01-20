'use strict';
var parse = require('co-body');
var notes = [
  { id: 0, note: 'A fast-paced 30min walk with viivi' },
  { id: 1, note: 'Agility race 2nd place with viivi' },
  { id: 2, note: 'Agility training session 90min with viivi' }
];

function *all() {
  this.body = yield notes;
}

function *fetch(id) {
  var note = notes[id];
  if (!note) {
    this.throw(404, 'note with id = ' + id + ' was not found');
  }
  this.body = yield note;
}

function *create() {
  var note = yield parse(this);
  var id = notes.push(note) - 1;
  note.id = id;
}

module.exports.all = all;
module.exports.fetch = fetch;
module.exports.create = create;
