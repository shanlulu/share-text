var mongoose = require('mongoose');
var connect = process.env.MONGODB_URI;
mongoose.connect(connect);

var userSchema = mongoose.Schema({
  username: String,
  password: String,
  ownedDocs: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doc'
  }],
  collabDocs: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doc'
  }]
})

var docSchema = mongoose.Schema({
  title: String,
  password: String,
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  collaborators: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  content: String,
  currWorkers: [{
    name: String,
    color: String
  }],
  colors: [String],
  history: [{
    text: String,
    date: String,
    time: String
  }]
})

User = mongoose.model('User', userSchema)
Doc = mongoose.model('Doc', docSchema)

module.exports = {
  User,
  Doc
}
