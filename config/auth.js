var LocalStrategy = require('passport-local').Strategy;
var bcrypt = require('bcrypt');
var mongoose = require('mongoose');
var User = mongoose.model('User');

module.exports = function (passport) {
  passport.use(new LocalStrategy(function (username, password, done) {
    User.findOne({ username: username }, function (err, user) {
      if (err) { return done(err); }
      if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
      }
      bcrypt.compare(password, user.password, function (err, result) {
        if (result === true) {
          return done(null, user);
        } else {
          return done(null, false, { message: 'Incorrect password.' });
        }
      });
    });
  }));

  passport.serializeUser(function (user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function (id, done) {
    User.findOne({ _id: id }, function (err, user) {
      done(err, user);
    });
  });

  var authenticated = function (req, res, next) {
    if (req.user) {
      next();
    } else {
      res.send(401, 'Unauthorized');
    }
  }

  var isAdmin = function (req, res, next) {
    if (req.user && req.user.admin === true) {
      next();
    } else {
      res.send(401, 'Unauthorized');
    }
  }

  var exists = function (req, res, next) {
    User.count({
      username: req.body.username
    }, function (err, count) {
      if (err) throw err;
      if (count === 0) {
        next();
      } else {
        res.send(409, { message: 'Username taken' });
      }
    });
  }

  return {
    authenticate: passport.authenticate('local'),
    authenticated: authenticated,
    exists: exists,
    isAdmin: isAdmin
  };
};
