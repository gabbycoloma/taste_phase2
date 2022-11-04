const express = require('express');
const bodyparser = require('body-parser');
const ejs = require('ejs');

const app = express();

app.use(express.static("public"));
app.use(express.static(__dirname));
app.use(bodyparser.urlencoded({extended:true}));
app.use(express.urlencoded({extended: true}));

// set the view engine to ejs
app.set('view engine', 'ejs');

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