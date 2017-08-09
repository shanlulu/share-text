var express = require('express');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var User = require('../models').User;
var Doc = require('../models').Doc;

var app = express();
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

var server = require('http').Server(app);
var io = require('socket.io')(server);


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

app.post('/register', function(req, res) {
  console.log('IN REGISTER');
  User.findOne({ username: req.body.username}, function(err, user) {
    if (err) {
      console.log('ERROR', err);
      res.status(404).send('ERROR');
    } else {
      if (user) {
        console.log('SAME NAME');
        res.status(404).send('Try another name!');
      } else {
        var u = new User({
          username: req.body.username,
          password: hashPassword(req.body.password),
          ownedDocs: [],
          collabDocs: []
        });
        u.save(function(err, user) {
          if (err) {
            console.log('ERROR', err);
            res.status(404).send('ERROR!');
          } else {
            console.log('SAVED', user);
            res.status(200).send('REGISTERED!');
          }
        });
      }
    }
  })
});


app.post('/login', function(req, res, next) {
  console.log('IN LOGIN');
    passport.authenticate('local', function(err, user, info) {
      if (err) { return res.status(404).send('ERROR'); }
      if (!user) { return res.status(404).send('NO USER'); }
      req.logIn(user, function(err) {
        if (err) { return res.status(404).send('ERROR'); }
        return res.status(200).send('SUCCESS');
      });
    })(req, res, next);
  });

app.get('/logout', function(req, res) {
    req.logout();
    res.status(200).send('LOGOUT SUCCESS');
  });

app.post('/newdoc', function(req, res) {
  var newDoc = new Doc({
    title: req.body.title,
    password: hashPassword(req.body.password),
    owner: req.user._id,
    collaborators: [req.user._id],
    content: "",
    currWorkers: [],
    colors: ['red', 'blue', 'yellow', 'green', 'purple', 'orange']
  });
  newDoc.save(function(err, doc) {
    if (err) {
      console.log('ERROR', err);
      res.status(404).send('ERROR');
    } else {
      console.log('SAVED DOC', doc);
      User.findById(req.user._id, function(err, user) {
        if (err) {
          console.log('ERROR', err);
          res.status(404).send('ERROR');
        } else {
          user.ownedDocs.push(doc._id);
          user.collabDocs.push(doc._id);
          user.save(function(err, newUser) {
            if (err) {
              console.log('ERROR', err);
              res.status(404).send('ERROR');
            } else {
              console.log('SAVED USER', newUser);
              res.status(200).send({
                newDoc: doc,
                newUser: newUser
              });
            }
          })
        }
      })
    }
  });
})

app.post('/docauth1', function(req, res) {
  Doc.findById(req.body.docId, function(err, doc) {
    if (doc.collaborators.includes(req.user._id)) {
      res.status(200).send("FREE TO VISIT THE DOC!");
    } else {
      res.status(404).send("NEED PASSWORD");
    }
  })
})

app.post('/docauth2', function(req, res) {
  Doc.findById(req.body.docId, function(err, doc) {
    if (doc.password === hashPassword(req.body.password)) {
      doc.collaborators.push(req.user._id);
      doc.save(function(err, newdoc) {
        if (err) {
          console.log('ERROR', err);
          res.status(404).send('ERROR');
        } else {
          console.log('SAVED DOC', newdoc);
          User.findById(req.user._id, function(err, user) {
            user.collabDocs.push(req.body.docId);
            user.save(function(err, newuser) {
              console.log('SAVED USER', newuser);
              res.status(200).send("FREE TO VISIT THE DOC!");
            })
          })
        }
      })
    } else {
      res.status(404).send("WRONG PASSWORD");
    }
  })
})

app.get('/getdocs', function(req, res) {
  Doc.find({}, function(err, docs) {
    if (err) {
      console.log("Error fetching docs", err)
    } else {
      docs.forEach(doc => {
        doc.currWorkers = []
        doc.save();
      })
      var id = req.user._id;
      res.send({docs, id});
    }
  })
})

app.post('/getdoc', function(req, res) {
  Doc.findById(req.body.id, function(err, doc) {
    if (err) {
      console.log("Error fetching doc", err)
    } else {
      console.log('d',doc.currWorkers)
      console.log(req.user.username)
      if (req.body.mount) {
        console.log('hi user')
        if (!doc.currWorkers.includes('@' + req.user.username)) {
          console.log('for real do')
          doc.currWorkers.push('@' + req.user.username)
        }
      } else {
        console.log('bye user')
        var newWorkers = []
        doc.currWorkers.forEach(worker => {
          if (worker !== ('@' + req.user.username)) {
            newWorkers.push(worker)
          }
          doc.currWorkers = newWorkers
        })
      }
      console.log('Workers:', doc.currWorkers)
      doc.save((err, d) => {
        if (err) {
          console.log(err)
        } else {
          res.send(d)
        }
      })
    }
  })
})

app.get('/checkuser', function(req, res) {
  res.send(req.user);
})

app.post('/savedoc', function(req, res) {
  Doc.findById(req.body.id, function(err, doc) {
    if (err) {
      console.log('ERROR', err);
      res.status(404).send('CANNOT FIND DOC');
    } else {
      console.log('FOUND DOC', doc);
      doc.content = req.body.content;
      doc.save(function(err, newDoc) {
        if (err) {
          console.log('ERROR', err);
          res.status(404).send('CANNOT SAVE DOC');
        } else {
          console.log('SAVED', newDoc);
          res.status(200).send(newDoc);
        }
      })
    }
  })
})

io.on('connection', socket => {
  console.log('Connection')

  socket.on('username', username => {
    if (!username || !username.trim()) {
      return socket.emit('errorMessage', 'No username!');
    }
    socket.username = String(username);
  });

  socket.on('room', requestedRoom => {
    console.log("ROOM : " + requestedRoom)
    if (!requestedRoom) {
      return socket.emit('errorMessage', 'No room!');
    }
    if (socket.room) {
      socket.leave(socket.room);
    }
    socket.room = requestedRoom;
    socket.join(requestedRoom, () => {
      socket.emit('joinMessage', {
        content: 'YOU joined ' + requestedRoom
      });
      socket.to(requestedRoom).broadcast.emit('joinMessage', {
        content: socket.username + ' joined ' + requestedRoom
      });
    });
  });

  socket.on('change', text => {
    console.log('Text: ', text)
    socket.emit('message', {
      content: 'YOU changed the doc'
    })
    socket.to(socket.room).broadcast.emit('message', {
      content: socket.username + ' changed the doc'
    });
  })

  socket.on('newWorker', workers => {
    console.log('Work: ', workers)
    socket.emit('message', {
      content: workers
    })
    socket.to(socket.room).broadcast.emit('newWorker', workers);
  })

  socket.on('leave', requestedRoom => {
    socket.leave(requestedRoom, () => {
      socket.emit('leaveMessage', {
        content: 'YOU left ' + requestedRoom
      });
      socket.to(requestedRoom).broadcast.emit('leaveMessage', {
        content: socket.username + ' left ' + requestedRoom
      });
    });
  })

  socket.on('leaveWorker', workers => {
    console.log('BYE: ', workers)
    socket.emit('leaveWorker', workers)
    socket.to(socket.room).broadcast.emit('leaveWorker', workers);
  })

})

server.listen(3000, function () {
  console.log('Backend server for Electron App running on port 3000!')
})
