const express = require('express');
const bodyparser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');
const date = require('date-and-time')
const fileUpload = require('express-fileupload');
const session = require('express-session');
const MongoDBsession = require('connect-mongodb-session')(session);
const bcrypt = require('bcryptjs');

const app = express();

const mongoURI = "mongodb://localhost:27017/taste";

app.use(express.static("public"));
app.use(express.static(__dirname));
app.use(bodyparser.urlencoded({ extended: true }));
app.use(express.urlencoded({ extended: true }));
app.use(fileUpload());


// set the view engine to ejs
app.set('view engine', 'ejs');

mongoose.connect("mongodb://localhost:27017/taste", {
        useNewUrlParser: true,
    })
    .then((res) => {
        console.log('DB is connected');
    });

const store = new MongoDBsession({
    uri: mongoURI,
    collection: 'mySession',
})

app.use(session({
    secret: 'key that will sign cookie',
    resave: false, //for every request, create sesson (false)
    saveUninitialized: false,
    store: store,
}));

const isAuth = (req, res, next) => {
    if (req.session.isAuth) {
        next();
    } else {
        res.redirect('/login')
    }
}


//Database Initialization
const UserModel = require('./models/UsersDB');
const PostsModel = require('./models/PostsDB');



const reviewRoute = require("./routes/Review");
const { post } = require('./routes/Review');
app.use('/review', reviewRoute);

app.get('/', isAuth, (req, res) => {
    PostsModel.find({}, function(err, rows) {
        if (err) {
            console.log(err);
        } else {
            res.render("index", { PostsModel: rows });
        }
    });
});

app.get('/review/view/:posts_id', function(req, res) {
    const posts_id = req.params.posts_id; //request the userId of the edited ID num

    PostsModel.find({ _id: posts_id }, function(err, result) {
        if (err) {
            console.log(err);
        } else {
            res.render("viewreview", { PostsModel: result[0] }); // returns the userId found 
        }
    });


});


app.get("/review/create", isAuth, (req, res) => {
    res.render('createreview');
})

app.post('/review/create/add', function(req, res) {
    console.log(req.files);
    // Get the file that was set to our field named "image_post"
    const { image_post } = req.files;

    // If no image submitted, exit
    if (!image_post) return res.sendStatus(400);

    image_post.mv(__dirname + '/images/posts/' + image_post.name);

    const newPost = PostsModel({
        username: "lgc.gabby",
        restaurant_name: req.body.restaurant_name,
        food_name: req.body.food_name,
        date: req.body.date,
        rating: req.body.rating,
        image_post: image_post.name,
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
    PostsModel.find({ username: 'lgc.gabby' }, function(err, rows) {
        if (err) {
            console.log(err);
        } else {
            res.render("vieweditreview", { PostsModel: rows });
        }
    });
})

app.get('/review/edit/:posts_id', function(req, res) {
    const posts_id = req.params.posts_id; //request the userId of the edited ID num
    PostsModel.find({ _id: posts_id }, function(err, result) {
        if (err) {
            console.log(err);
        } else {
            res.render("editreview", { PostsModel: result[0] }); // returns the userId found 
        }
    });
})

app.post('/review/edit/:posts_id/update', function(req, res) {
    const postID = req.body.id;
    const username = "lgc.gabby";
    const query = { _id: postID };
    const restaurant_name = req.body.restaurant_name;
    const food_name = req.body.food_name;
    const rating = req.body.rating;
    const review = req.body.review;

    console.log(postID);
    console.log(restaurant_name);
    PostsModel.updateOne(query, { restaurant_name: restaurant_name, food_name: food_name, rating: rating, review: review }, function(err, docs) {
        if (err) {
            console.log(err);
        } else {
            console.log("Updated Docs : ", docs);
            res.redirect("/");
        }
    });
});

app.get('/review/delete', function(req, res) {
    PostsModel.find({ username: 'lgc.gabby' }, function(err, rows) {
        if (err) {
            console.log(err);
        } else {
            res.render("deletereview", { PostsModel: rows });
        }
    });
});

app.get('/review/delete/:posts_id', function(req, res) {
    const posts_id = req.params.posts_id; //request the userId of the edited ID num
    PostsModel.deleteOne({ _id: posts_id }, function(err, docs) {
        if (err) {
            console.log(err);
        } else {
            console.log("Updated Docs : ", docs);
            res.redirect("/");
        }
    });
});



app.get('/profile', function(req, res) {
    res.render('profile');
});

app.get('/landingpage', function(req, res) {
    res.render('landingpage');
});

//Login User
app.get('/login', function(req, res) {
    res.render('login');
});

app.post('/login', async(req, res) => {
    const { email, password } = req.body;

    let users = await UserModel.findOne({ email });
    session.user_id = users._id;
    session.username = users.username;
    console.log(session.user_id);

    if (!users) {
        return res.redirect("/login");
    }

    const isMatch = await bcrypt.compare(password, users.password);

    if (!isMatch) {
        return res.redirect("/login");
    }

    req.session.isAuth = true
    res.redirect("/");
});

//Sign Up User
app.get('/signup', function(req, res) {
    res.render('signup');
});

app.post('/signup', async(req, res) => {
    const { firstname, lastname, username, email, password } = req.body;

    let users = await UserModel.findOne({ email });

    if (users) {
        return res.redirect('/signup')
    }
    const salt = bcrypt.genSaltSync(10);
    const hashedPW = await bcrypt.hash(password, salt);
    console.log(hashedPW);
    users = new UserModel({
        firstname,
        lastname,
        username,
        email,
        password: hashedPW,
    });
    console.log(req.body.email);
    await users.save();

    res.redirect('/login');

});

app.get('/logout', function(req, res) {
    req.session.destroy((err) => {
        if (err) throw err;

        res.redirect("/landingpage");
    })
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