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

const mongoURI = "mongodb://0.0.0.0:27017/taste";

app.use(bodyparser());
app.use(express.static("public"));
app.use(express.static(__dirname));
app.use(bodyparser.urlencoded({ extended: true }));
app.use(express.urlencoded({ extended: true }));
app.use(fileUpload());
app.use(express.json());


// set the view engine to ejs
app.set('view engine', 'ejs');

mongoose.connect("mongodb://0.0.0.0:27017/taste", {
        useNewUrlParser: true,
    })
    .then((res) => {
        console.log('DB is connected');
    });

const store = new MongoDBsession({
    uri: mongoURI,
    collection: 'sessions'
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

app.use(function(req, res, next) {
    res.locals.session = req.session;
    next();
});

//Database Initialization
const UserModel = require('./models/UsersDB');
const PostsModel = require('./models/PostsDB');
const CommentsModel = require('./models/CommentsDB');



// const reviewRoute = require("./routes/Review");
const { post } = require('./routes/Review');
const { init } = require('./models/PostsDB');
// app.use('/review', reviewRoute);

app.get('/', isAuth, async(req, res) => {
    const posts = await PostsModel.find().sort({
        date: 'desc'
    })

    res.render("index", { posts: posts })

});

app.get('/review/view/:posts_id', async(req, res) => {
    //request the userId of the edited ID num

    let posts = await PostsModel.findOne({ _id: req.params.posts_id });

    let comments = await CommentsModel.find({ posts: req.params.posts_id });



    res.render("viewreview", { posts, comments });
});

app.post('/review/view/:posts_id/like', async(req, res) => {
    const posts_id = req.params.posts_id; //request the userId of the edited ID num

    await PostsModel.updateOne({
        _id: posts_id,
        likes: { $ne: posts_id }
    }, {
        $inc: { likeCount: 1 },
        $push: { likes: req.session._id }
    })


    res.redirect('back');
});
app.post('/review/view/:posts_id/dislike', async(req, res) => {
    const posts_id = req.params.posts_id; //request the userId of the edited ID num

    await PostsModel.updateOne({
        _id: posts_id,
        likes: { $ne: posts_id }
    }, {
        $inc: { likeCount: -1 },
        $pull: { likes: req.session._id }
    })

    res.redirect('back');

});


app.post('/review/view/:posts_id/comment', async(req, res) => {
    const posts_id = req.params.posts_id; //request the userId of the edited ID num

    const comment = new CommentsModel({
        username: req.session.username,
        comment: req.body.comment,
        posts: posts_id
    })

    //save comment
    await comment.save();

    const postRelated = await PostsModel.findById(posts_id);

    postRelated.comments.push(comment);

    await postRelated.save(function(err, docs) {
        if (err) {
            console.log(err)
        } else {
            res.redirect('/review/view/' + posts_id);
            console.log("Updated Docs : ", docs);
            console.log("added to db");
        }
    })
});


app.get("/review/create", isAuth, (req, res) => {
    res.render('createreview');
})

app.post('/review/create/add', function(req, res) {
    console.log(req.files);
    console.log("added to db");
    // Get the file that was set to our field named "image_post"
    const { image_post } = req.files;

    // If no image submitted, exit
    if (!image_post) return res.sendStatus(400);

    image_post.mv(__dirname + '/images/posts/' + image_post.name);

    const newPost = PostsModel({
        username: req.session.username,
        user_image: req.body.user_image,
        user_id: req.session._id,
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
    PostsModel.find({ username: req.session.username }, function(err, rows) {
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
    const username = req.session.username;
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
    PostsModel.find({ username: req.session.username }, function(err, rows) {
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



app.get('/profile', async function(req, res) {
    const posts = await PostsModel.find({ username: req.session.username });


    UserModel.findOne({ username: req.session.username }, function(err, result) {
        if (err) {
            console.log(err);
        } else {
            res.render('profile', { UserModel: result, posts: posts });
        }
    });
});

app.post('/profile/edit', async(req, res) => {
    var initialUsername = req.session.username;
    console.log("added to db");
    // Get the file that was set to our field named "user_image"


    // If no image submitted, exit


    const firstName = req.body.firstname;
    const lastName = req.body.lastname;
    const userName = req.body.username;
    const email = req.body.email;
    const bio = req.body.bio;

    const userID = req.body.id;
    const query = { _id: userID };

    // Username Validation
    const takenUsername = await UserModel.findOne({username: userName });
    if(takenUsername) {
        console.log("Username already taken");
        return res.redirect('back');
    }

    // Email Validation
    const takenEmail = await UserModel.findOne({email: email });
    if(takenEmail && !(takenEmail.username == req.session.username)) {
        console.log(takenEmail.username);
        console.log("Email already taken");
        return res.redirect('back');
    }
    
    console.log("Initial username: " + initialUsername + "            Username Changed: " + userName );
    await PostsModel.updateMany({ username: initialUsername }, { $set: { username: userName } });
    await CommentsModel.updateMany({ username: initialUsername }, { $set: { username: userName } });
    UserModel.updateOne(query, { username: userName, firstname: firstName, lastname: lastName, email: email, Bio: bio }, function(err, result) {
        if (err) {
            console.log(err);
        } else {
            req.session.username = userName;
            req.session.firstname = firstName;
            req.session.lastname = lastName;
            res.redirect('back');
        }
    });
});

app.post('/profile/edit/image', async function(req, res) {
    var initialUsername = req.session.username;
    var initialImage = req.session.user_image;
    console.log(req.files);
    console.log("added to db");
    // Get the file that was set to our field named "user_image"
    // If no image submitted, exit
    var { user_image } = req.files;
    if (!user_image) return res.sendStatus(400);

    user_image.mv(__dirname + '/images/profile/' + user_image.name);

    user_image = user_image.name;
    const userID = req.body.id;
    const query = { _id: userID };



    UserModel.updateOne(query, { user_image: user_image }, async function(err, result) {
        if (err) {
            console.log(err);
        } else {
            req.session.user_image = user_image;
            await PostsModel.updateMany({ username: initialUsername }, { $set: { user_image: user_image } });
            res.redirect('back');
        }
    });

});

//CHANGE PASSWORD OF USER
app.post('/profile/edit/password', async function(req, res) {

    const actualCurrentPassword = req.body.actual_currentPW;
    const currentPassword = req.body.current_password;
    const newPassword = req.body.new_password;
    const confirmPassword = req.body.confirm_password;

    const userID = req.body.id;
    const query = { _id: userID };

    const isMatch = await bcrypt.compare(currentPassword, actualCurrentPassword);

    if (isMatch && (newPassword === confirmPassword)) {

        const salt = bcrypt.genSaltSync(10);
        const hashedPW = await bcrypt.hash(newPassword, salt);

        UserModel.updateOne(query, { password: hashedPW }, (err, result) => {
            if (err) {
                console.log(err);
            } else {
                console.log(hashedPW);
            }
        });

    } else if (!isMatch) {
        console.log("Wrong Password");
    } else if (isMatch) {
        console.log("Passwords do not match");
    }
    return res.redirect('back');
});


app.get('/landingpage', async function(req, res) {
    const posts = await PostsModel.find().sort({
        rating: 'desc'
    }).limit(2);

    res.render('landingpage', { posts: posts });
});

//Login User
app.get('/login', function(req, res) {
    res.render('login');
});

app.post('/login', async(req, res) => {
    const { email, password } = req.body;

    let users = await UserModel.findOne({ email });

    if (!users) {
        return res.redirect("/login");
    }

    const isMatch = await bcrypt.compare(password, users.password);

    if (!isMatch) {
        return res.redirect("/login");
    }

    req.session.isAuth = true;
    res.session = users;
    req.session._id = users._id;
    req.session.username = users.username;
    req.session.firstname = users.firstname;
    req.session.lastname = users.lastname;
    req.session.user_image = users.user_image;
    console.log("")
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
        Bio: "The user has not added a bio yet."
    });
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

app.post('/search', function(req, res) {

    searchQuery = req.body.search_query
    console.log(searchQuery);

    PostsModel.find({
        $or: [{ username: new RegExp(searchQuery, 'i') }, { food_name: { $regex: new RegExp(searchQuery, 'i') } }, { restaurant_name: { $regex: new RegExp(searchQuery, 'i') } }]
    }, (err, searchResults) => {
        if (err) {
            console.log(err);
        } else {
            res.render('searchresults', {
                searchKey: searchQuery,
                posts: searchResults
            });
        }
    }).sort({ date: 'desc' });


});

app.listen(3000, function() {
    console.log("Server is running on port 3000.");
});