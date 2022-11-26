const express = require("express");
const router = express.Router();
const UserModel = require('../models/UsersDB');
const PostsModel = require('../models/PostsDB');
const CommentsModel = require('../models/CommentsDB');

const controller = require('../controllers/ReviewController');

// router.get('/view/:posts_id'), async(req, res) => {
//     //request the userId of the edited ID num
//     let posts = await PostsModel.findOne({ _id: req.params.posts_id });
//     let comments = await CommentsModel.find({ posts: req.params.posts_id });

//     res.render("viewreview", { posts, comments });
// };

module.exports = router;