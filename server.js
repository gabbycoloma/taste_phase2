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












app.listen(3000, function(){
  console.log("Server is running on port 3000.");
});