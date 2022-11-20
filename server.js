const express = require('express');
const bodyparser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');


const app = express();

app.use(express.static("public"));
app.use(express.static(__dirname));
app.use(bodyparser.urlencoded({ extended: true }));
app.use(express.urlencoded({ extended: true }));
// set the view engine to ejs
app.set('view engine', 'ejs');




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
    rating: Number,
    review: String,
    likes: Number
};

const user = mongoose.model("users", schema);
const posts = mongoose.model("posts", schema_posts);


const reviewRoute = require("./routes/Review");
const { post } = require('./routes/Review');
app.use('/review', reviewRoute);

app.get('/', function(req, res) {
    posts.find({}, function(err, rows) {
        if (err) {
            console.log(err);
        } else {
            res.render("index", { posts: rows });
        }
    });
});

app.post('/review/create/add', function(req, res) {
    const newPost = posts({
        restaurant_name: req.body.restaurant_name,
        food_name: req.body.food_name,
        date: req.body.date,
        rating: req.body.rating,
        //post_image: req.body.post_image,
        review: req.body.review
    });

    // CREATE - adding records to the DB
    newPost.save(function(err, docs) {
        if (err) {
            console.log(err);
        } else {
            res.redirect("/");
            console.log("Updated Docs : ", docs);
            console.log("added to db");
        }
    })

});

app.get('/review/edit', function(req, res) {
    posts.find({ username: 'lgc.gabby' }, function(err, rows) {
        if (err) {
            console.log(err);
        } else {
            res.render("vieweditreview", { posts: rows });
        }
    });
})

app.get('/review/edit/:posts_id', function(req, res) {
    const posts_id = req.params.posts_id; //request the userId of the edited ID num
    posts.find({ _id: posts_id }, function(err, result) {
        if (err) {
            console.log(err);
        } else {
            res.render("editreview", { posts: result[0] }); // returns the userId found 
        }
    });
})

app.post('/review/edit/update', function(req, res) {
    const postID = req.body.id;
    const query = { _id: postID };
    const restaurant_name = req.body.restaurant_name;
    const food_name = req.body.food_name;
    const review = req.body.review;

    console.log(postID);
    console.log(restaurant_name);
    posts.updateOne(query, { restaurant_name: restaurant_name, food_name: food_name, review: review }, function(err, docs) {
        if (err) {
            console.log(err);
        } else {
            console.log("Updated Docs : ", docs);
            res.redirect("/");
        }
    });
});




app.get('/review/delete', function(req, res) {
    posts.find({ username: 'lgc.gabby' }, function(err, rows) {
        if (err) {
            console.log(err);
        } else {
            res.render("viewdeletereview", { posts: rows });
        }
    });
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

app.get('/about', function(req, res) {
    res.render('aboutus');
});

app.get('/search', function(req, res) {
    res.render('searchresults');
});















app.listen(3000, function() {
    console.log("Server is running on port 3000.");
});