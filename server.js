const express = require('express');
const bodyparser = require('body-parser');
const ejs = require('ejs');
const mongoose = require("mongoose"); // mongodb 

const app = express();

// connect to database
mongoose.connect("mongodb://localhost:27017/tasteDB", {useNewUrlParser: true}); //tasteDB name of the Database

app.use(express.static("public"));
app.use(express.static(__dirname));
app.use(bodyparser.urlencoded({extended:true}));
app.use(express.urlencoded({extended: true}));

// set the view engine to ejs
app.set('view engine', 'ejs');

const userSchema = { 
  // user attributes like username, last and first name, posts
};

const posts = {
  // posts attributes i.e. title, subtitle, date, image, post text, etc
};


app.get('/', function(req, res) {
  res.render('index');
});

app.get('/createreview', function(req, res) {
  res.render('createreview');
});

app.get('/editreview', function(req, res) {
  res.render('editreview');
});

app.get('/profile', function(req, res) {
  res.render('profile');
});

app.get('/landingpage', function(req, res) {
  res.render('landingpage');
});

app.get('/loginsignup', function(req, res) {
  res.render('loginsignup');
});

app.get('/aboutus', function(req, res) {
  res.render('aboutus');
});

app.get('/search', function(req, res) {
  res.render('searchresults');
});















app.listen(3000, function(){
  console.log("Server is running on port 3000.");
});