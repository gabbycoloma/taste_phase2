const express = require('express');
const bodyparser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');


mongoose.connect("mongodb://localhost:27017/taste", { useNewUrlParser: true }, (err) => {
    if (!err) console.log('DB is connected');
    else console.log('DB Error');
});

const schema = {
    username: String,
    password: String,
    firstname: String,
    lastname: String,
    email: String,
    Bio: String,
};

const schema_posts = {
    username: String,
    date: { type: Date, default: Date.now },
    image_post: String,
    food_name: String,
    restaurant_name: String,
    stars: Number,
    review: String,
    likes: Number
};

const user = mongoose.model("users", schema);

const posts = mongoose.model("posts", schema_posts);

const app = express();

app.use(express.static("public"));
app.use(express.static(__dirname));
app.use(bodyparser.urlencoded({ extended: true }));
app.use(express.urlencoded({ extended: true }));

// set the view engine to ejs
app.set('view engine', 'ejs');

app.get('/', function(req, res) {
    posts.find({}, function(err, rows) {
        if (err) {
            console.log(err);
        } else {
            res.render("index", { posts: rows });
        }
    });
});

app.get('/createreview', function(req, res) {
    res.render('createreview');

});

app.post('/addreview', function(req, res) {
    const newPost = posts({
        date: req.body.date,
        post_image: req.body.post_image,
        food_name: req.body.food_name,
        restaurant_name: req.body.restaurant_name,
        review: req.body.review
    });

    // CREATE - adding records to the DB
    newPost.save(function(err) {
        if (err) {
            console.log(err);
        } else {
            res.redirect("/");
            console.log("added to db");
        }
    })

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















app.listen(3000, function() {
    console.log("Server is running on port 3000.");
});