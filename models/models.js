"use strict";

var mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URI);

var User = mongoose.model("User", {
  username: String,
  password: String
});

var Document = mongoose.model("Document", {
  author: String,
  content: String
})

module.exports = {
  User: User,
  Document: Document
}
