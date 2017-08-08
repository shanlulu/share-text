var express = require('express');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var User = require('../models').User;

var app = express();
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));


var mongoose = require('mongoose');
mongoose.connection.on('connected', function() {
  console.log('Connected to MongoDB!');
});
mongoose.connect(process.env.MONGODB_URI);

var crypto = require('crypto');
function hashPassword(password) {
  var hash = crypto.createHash('sha256');
  hash.update(password);
  return hash.digest('hex');
}

app.use(session({
  secret: 'You never know.',
  store: new MongoStore({mongooseConnection: mongoose.connection})
}));


passport.use(new LocalStrategy(
   function(username, password, done) {
     var hashedPassword = hashPassword(password);
     User.findOne({username: username}, function(err, user) {
      if (err) return done(err);
      if (!user) return done(null, false, { message: 'Invalid Username.'});
      if (user.password !== hashedPassword) return done(null, false, { message: 'Wrong Password.'});
      return done(null, user);
    })
  })
)

passport.serializeUser(function(user, done) {
  done(null, user._id);
})

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    if (err) {
      console.log('ERROR', err);
    } else {
      done(null, user);
    }
  })
})

app.use(passport.initialize());
app.use(passport.session());

// app.get('/register', function(req, res) {
//   res.send('IN REGISTER');
// });

app.post('/register', function(req, res) {
  console.log('IN POST REGISTER');
  var u = new User({
    username: req.body.username,
    password: hashPassword(req.body.password),
    ownedDocs: [],
    collabDocs: []
  });
  u.save(function(err, user) {
    if (err) {
      console.log('ERROR', err);
      // res.status(500).redirect('/register');
    } else {
      console.log('SAVED', user);
      res.send('POST LOGIN SUCCESS');
    }
  });
});


app.post('/login', function(req, res, next) {
    passport.authenticate('local', function(err, user, info) {
      if (err) { return next(err); }
      if (!user) { return res.send('NO USER'); }
      req.logIn(user, function(err) {
        if (err) { return next(err); }
        return res.send('SUCCESS');
      });
    })(req, res, next);
  });

// app.get('/logout', function(req, res) {
//   req.logout();
//   res.redirect('/login');
// });

app.listen(3000, function () {
  console.log('Backend server for Electron App running on port 3000!')
})
